import DashboardModel from '../models/Dashboard.js';

class DashboardService {
  static async getDashboardData() {
    return await DashboardModel.getSummaryStats();
  }
}

export default DashboardService;
