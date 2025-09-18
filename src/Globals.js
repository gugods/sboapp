let SERVER_API = '';
let MANUAL_URL = '';
if (process.env.NODE_ENV === 'test') {
  SERVER_API = 'http://192.168.2.43:90/sboplus/graphql';
  MANUAL_URL = 'http://192.168.2.43/sboplus/web_manual';
} else if (process.env.NODE_ENV === 'development') {
  SERVER_API = 'http://192.168.2.43:90/sboplus/graphql';
  MANUAL_URL = 'http://192.168.2.43/sboplus/web_manual';
} else if (process.env.NODE_ENV === 'production') {
  SERVER_API = 'http://sboplus.info/graphql';
  MANUAL_URL = 'http://sboplus.info/web_manual';
}

module.exports = {
  APPLE_STORE_URL: 'itms-apps://itunes.apple.com/th/app/id6443744970?mt=8',
  PLAY_STORE_URL: 'market://details?id=com.sboplus',
  LANG_DEFAULT: 'TH',
  APP_SECRET_KEY:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhcHBfbmFtZSI6IlNiby1CcmFuZCIsImFwcF92ZXJzaW9uIjoiMS4wIn0.mspZy5wakmJySmpYAozPTvYKyptokNjq6R81Olc71ek',
  SERVER_API: SERVER_API,
  MANUAL_URL: MANUAL_URL,
  CHECK_INTERNET: true,
  CHECK_ERROR: true,
  CHECK_BACK: true,
  SCREEN: 'HOME',
  COLOR_MAIN: '#9d456f',
  COLOR_ACTIVE: '#891a4d',
  COLOR_WHITE: '#ffffff',
  COLOR_GRAY: '#f8f8f9',
  COLOR_GRAY1: '#f2f2f2',
  COLOR_GRAY2: '#dddddd',
  COLOR_LINE: '#eeeeee',
  COLOR_BLACK: '#000000',
  COLOR_THEAD: '#555555',
  COLOR_TBODY: '#555555',
  COLOR_SUCCESS: '#5cb85c',
  COLOR_ERROR: '#d9534f',
  COLOR_CANCEL: '#aaaaaa',
  COLOR_TITLE: '#333333',
  COLOR_DESC: '#4a4a4a',
  COLOR_REMARK: '#8f8f8f',
  COLOR_SEARCH: '#8b93a2',
  COLOR_PENDING: '#fb8623',
  COLOR_PLACEHOLDER: '#cccccc',
  FONT_NAME: null,
  FONT_REG: 'normal',
  FONT_BOLD: 'bold',
  CUTOFF_DATE: 10,
  DATE_ALLOWS: [11, 12, 13, 14, 15],
  MENUS: {
    stock_show: { name: 'TEXT_MENU_STOCK_SHOW', route: null, icon: 'archive' },
    stock_count: { name: 'TEXT_MENU_STOCK_COUNT', route: 'StockCount', icon: 'reader' },
    stock_in: { name: 'TEXT_MENU_STOCK_IN', route: 'StockIn', icon: 'cube' },
    stock_out: { name: 'TEXT_MENU_STOCK_OUT', route: 'StockOut', icon: 'logo-dropbox' },
    stock_card: { name: 'TEXT_MENU_STOCK_CARD', route: 'StockCard', icon: 'copy' },
    sale_report: { name: 'TEXT_MENU_SALES', route: 'Sale', icon: 'filing' },
    stock_pending: { name: 'TEXT_MENU_STOCK_PENDING', route: 'StockPending', icon: 'time' },
    stock_outing: { name: 'TEXT_MENU_STOCK_OUTING', route: 'StockOuting', icon: 'time-outline' },
    live_chat: { name: 'TEXT_MENU_LIVE_CHAT', route: 'LiveChat', icon: 'chatbubbles' },
    stock_report: { name: 'TEXT_MENU_REPORT', route: 'Report', icon: 'copy' },
    stock_product: { name: 'TEXT_MENU_STOCK_PRODUCT', route: 'StockProduct', icon: 'file-tray-stacked' },
    training: { name: 'TEXT_MENU_TRAINING', route: 'linkOut', icon: 'school' },
    pos_commission: { name: 'TEXT_MENU_POS_COMMISSION', route: 'linkOut', icon: 'calculator' },
    time_mint: { name: 'TEXT_MENU_TIME_MINT', route: 'linkOut', icon: 'car' },
  },
  ICONS: {
    search: {
      name: 'search',
      size: 20,
    },
    arrowUp: {
      name: 'chevron-up',
      size: 20,
    },
    arrowDown: {
      name: 'chevron-down',
      size: 20,
    },
    selectArrowDown: {
      name: 'chevron-down',
      size: 20,
    },
    close: {
      name: 'close',
      size: 20,
    },
    check: {
      name: 'checkmark',
      size: 20,
    },
    cancel: {
      name: 'close',
      size: 20,
    },
  },
};
