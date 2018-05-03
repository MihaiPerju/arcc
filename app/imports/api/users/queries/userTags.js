import Users from '../collection';

export default Users.createNamedQuery('userTags', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    tagIds: 1,
    tags: {
        name: 1
    }
});