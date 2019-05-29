import { getBaseURL } from '../../utils/actionHelperFunctions'

export const LOAD_INVOICES_URL = `${getBaseURL('accounts')}/accounts/v1/invoices`
export const SEARCH_ORG_BY_ID_URL = `${getBaseURL('org')}/org/v1/orgs`
export const URL_ROOT_PROGRAM = getBaseURL('program')
export const LOAD_COVERS_URL = `${getBaseURL('cover')}/cover/v2/summaries/SALES_AND_CANCELLATIONS`

export const LOAD_INVOICES = 'LOAD_INVOICES'
export const DOWNLOAD_INVOICES = 'DOWNLOAD_INVOICES'
export const SEARCH_INVOICES_BY = 'SEARCH_INVOICES_BY'
export const SEARCH_ORGS_BY = 'SEARCH_ORGS_BY'
export const LOAD_INVOICES_PENDING = 'LOAD_INVOICES_PENDING'
export const LOAD_INVOICES_FULFILLED = 'LOAD_INVOICES_FULFILLED'
export const LOAD_INVOICES_REJECTED = 'LOAD_INVOICES_REJECTED'
export const LOAD_MERCHANT_COMPLETED = 'LOAD_MERCHANT_COMPLETED'


export const LOAD_COVERS = 'LOAD_COVERS'

export const LABEL_INVOICE = 'Invoices'