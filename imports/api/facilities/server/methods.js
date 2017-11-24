import {Meteor} from "meteor/meteor";
import Facilities from "/imports/api/facilities/collection.js";
import Security from '/imports/api/security/security.js';
import FacilitySchema from "../schema.js";

Meteor.methods({
    'facility.create' (data) {
        Security.isAdminOrTech(this.userId);

        Facilities.insert(data);
    },

    'facility.get' (facilityId) {
        Security.isAdminOrTech(this.userId);
        return Facilities.findOne(facilityId);
    },

    'facility.update' (facility) {
        Security.isAdminOrTech(this.userId);
        const facilityData = FacilitySchema.clean(facility);

        Facilities.update({_id: facility._id}, {
            $set: facilityData
        })
    },

    'facility.remove' (facilityId) {
        Security.isAdminOrTech(this.userId);

        Facilities.remove(facilityId);
    }
});