import React from "react";
import pdf from "html-pdf";
import Future from "fibers/future";
import QRCode from "qrcode";
import ReactDOMServer from "react-dom/server";
import Accounts from "/imports/api/accounts/collection";
import Clients from "/imports/api/clients/collection";
import Settings from "/imports/api/settings/collection";
import Business from "/imports/api/business";
import { Random } from "meteor/random";
import { existsSync, renameSync, unlinkSync } from "fs";
import PDFMerge from "pdfmerge";
import Uploads from "/imports/api/s3-uploads/uploads/collection";
import Letters from "/imports/api/letters/collection";
import AccountActions from "/imports/api/accountActions/collection";
import actionTypesEnum from "/imports/api/accounts/enums/actionTypesEnum";
import Statuses from "/imports/api/letters/enums/statuses.js";

const { rootFolder } = Settings.findOne({
  rootFolder: {
    $ne: null
  }
});

export default class LetterService {
  static createLetter(data) {
    const { userId, accountId, letterTemplateId, letterTemplateName } = data;
    const { clientId } = Accounts.findOne({ _id: accountId });
    const letterData = {
      userId,
      type: actionTypesEnum.LETTER,
      createdAt: new Date(),
      accountId,
      letterTemplateId,
      clientId,
      letterTemplateName
    };
    const letterId = Letters.insert(data);

    // create the pdf for the created letter
    this.createPdf(letterId);

    // create the account action type 'letter'
    AccountActions.insert(letterData);
  }

  static updateLetter(
    _id,
    { body, letterTemplateId, attachmentIds, letterValues }
  ) {
    const { status } = Letters.findOne({ _id });
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }

    Letters.update(
      { _id },
      {
        $set: {
          body,
          letterTemplateId,
          attachmentIds,
          letterValues
        }
      }
    );
    this.createPdf(_id);
  }

  static deleteLetter(_id) {
    const { status } = Letters.findOne({ _id });
    const filePath = rootFolder + Business.ACCOUNTS_FOLDER + _id + ".pdf";
    if (status !== Statuses.NEW) {
      throw new Meteor.Error(
        "cannot edit",
        "Sorry, the letter is already picked up by the system"
      );
    }
    Letters.remove(_id);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }

  static createPdf(letterId) {
    let { attachmentIds, body, accountId } = Letters.findOne({ _id: letterId });
    const { clientId } = Accounts.findOne({ _id: accountId });
    const { clientName } = Clients.findOne({ _id: clientId });
    const filePath = rootFolder + Business.ACCOUNTS_FOLDER + letterId + ".pdf";
    const future = new Future();

    QRCode.toDataURL(clientName)
      .then(url => {
        body = ReactDOMServer.renderToString(<img src={url} />) + body;
        pdf.create(body).toFile(filePath, (err, res) => {
          if (err) {
            future.return(err);
          } else {
            future.return(res);
          }
        });
      })
      .catch(err => {
        console.error(err);
      });

    const { filename } = future.wait();
    if (filename) {
      this.attachPdfs(filename, attachmentIds);
    }
  }

  static attachPdfs(filename, attachmentIds) {
    let files = [filename];

    for (let _id of attachmentIds) {
      const { path } = Uploads.findOne({
        _id
      });
      const attachmentPath = rootFolder + Business.ACCOUNTS_FOLDER + path;
      files.push(attachmentPath);
    }

    let newFilename =
      rootFolder + Business.ACCOUNTS_FOLDER + Random.id() + ".pdf";
    while (existsSync(newFilename)) {
      newFilename =
        rootFolder + Business.ACCOUNTS_FOLDER + Random.id() + ".pdf";
    }

    PDFMerge(files, newFilename)
      .then(function() {
        renameSync(newFilename, filename);
      })
      .catch(function(error) {
        //returns error
      });
  }
}