import SimpleSchema from 'simpl-schema';
import ContactTypes from '/imports/api/facilities/enums/contactTypes';

export default new SimpleSchema({
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    contactType: {
        label: 'Contact type',
        type: String,
        allowedValues: [ContactTypes.TECHNICAL, ContactTypes.MANAGEMENT, ContactTypes.OTHER],
        optional: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
    notes: {
        type: String
    }
});