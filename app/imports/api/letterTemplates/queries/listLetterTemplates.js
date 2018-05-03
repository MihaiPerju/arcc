import LetterTemplates from '../collection';

export default LetterTemplates.createNamedQuery('listLetterTemplates', {
    $filter({filters, options, params}) {
        filters.clientId = params.clientId;
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    content: 1,
    codes: {
        code: 1
    },
    body: 1,
    description: 1,
    keywords: 1,
    category: 1
});