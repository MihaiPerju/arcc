import InsuranceCompanies from '../collection';

export default InsuranceCompanies.createNamedQuery('insuranceCompaniesList', {
    $filter({filters, options, params}) {
        _.extend(filters, params.filters);
        _.extend(options, params.options);
    },
    $paginate: true,
    name: 1,
    aliases: 1
});