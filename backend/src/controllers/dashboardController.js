import DashboardService from '../services/dashboardService.js';

// GET /api/dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const stats = await DashboardService.getDashboardData();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
