import * as Constants from './constants'

const DEFAULT_INVOICES_STATE = {

  invoices:null,
  invoices_total:0,
  invoices_pending:false,
  invoices_error:null,
  invoices_has_error:false,

}

const createInvoicesReducer = (state = DEFAULT_INVOICES_STATE, action) => {
  switch (action.type) {

    case Constants.LOAD_INVOICES_PENDING: {
      return {
        ...state,
        invoices_pending: true,
        invoices_error: null,
        invoices_has_error:false,
      }
    }

    case Constants.LOAD_INVOICES_REJECTED: {
      return {
        ...state,
        invoices_pending: false,
        invoices_has_error:true,
        invoices_error: action.payload.response ? action.payload.response : null
      }
    }

    case Constants.LOAD_INVOICES_FULFILLED: {
      console.log(action)
      return {
        ...state,
        invoices_pending: false,
        invoices_total:  action.payload.headers['x-lc-pagination-total'] ? parseInt(action.payload.headers['x-lc-pagination-total']) : 0,
        invoices: action.payload.data ? action.payload.data : null
      }
    }

    case Constants.LOAD_MERCHANT_COMPLETED:
    {
      return {
        ...state,
        loadmerchantcomplated: 1
      }
    }
    case Constants.DOWNLOAD_INVOICES.toLowerCase():
    {
      return {
        ...state,
        invoicePdfFile: action.data
      }
    }

    default:
      return state
  }
}

export default createInvoicesReducer