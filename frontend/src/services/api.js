/**
 * EcoSentinel Bangalore - API Service
 * Handles communication with the Flask backend endpoints.
 */

const API_BASE_URL = 'http://127.0.0.1:5000/api';

export const api = {
  /**
   * Fetch complete system status: landfills, alerts, totals, species profiles
   */
  async getStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn('[EcoSentinel API] Fetch failed, returning cached/fallback data', error);
      return null;
    }
  },

  /**
   * Trigger a simulated satellite CV scan sweep over Double Road / Shanthi Nagar
   */
  async triggerScan() {
    try {
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[EcoSentinel API] Scan trigger error:', error);
      throw error;
    }
  },

  /**
   * Deploy additional bio-remediation worm units to a landfill site
   */
  async deployWorms(landfillId, units = 1, species = 'Galleria mellonella') {
    try {
      const response = await fetch(`${API_BASE_URL}/deploy-worms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          landfill_id: landfillId,
          units: parseInt(units, 10),
          species: species,
        }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[EcoSentinel API] Worm deployment error:', error);
      throw error;
    }
  },

  /**
   * Fetch latest computer vision satellite imagery frames
   */
  async getSatelliteFeed() {
    try {
      const response = await fetch(`${API_BASE_URL}/satellite-feed`);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[EcoSentinel API] Feed fetch error:', error);
      return null;
    }
  },

  /**
   * Acknowledge or resolve an active BBMP grievance alert ticket
   */
  async resolveAlert(ticketId) {
    try {
      const response = await fetch(`${API_BASE_URL}/resolve-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket_id: ticketId }),
      });
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('[EcoSentinel API] Resolve alert error:', error);
      throw error;
    }
  }
};
