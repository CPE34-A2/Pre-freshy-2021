import axios from 'axios'

axios.defaults.baseURL = process.env.WEB_URL || 'http://localhost:3000'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios