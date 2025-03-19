import axios from 'axios';

const HELIUS_API_URL = 'https://api.helius.dev/v0';
const API_KEY = process.env.HELIUS_API_KEY;

interface HeliusWebhookPayload {
  webhookURL: string;
  transactionTypes?: string[];
  accountAddresses?: string[];
  webhookType?: string;
  authHeader?: string;
}

export async function createWebhook(payload: HeliusWebhookPayload): Promise<{ webhookID: string }> {
  try {
    const response = await axios.post(`${HELIUS_API_URL}/webhooks?api-key=${API_KEY}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating Helius webhook:', error);
    throw error;
  }
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  try {
    await axios.delete(`${HELIUS_API_URL}/webhooks/${webhookId}?api-key=${API_KEY}`);
  } catch (error) {
    console.error('Error deleting Helius webhook:', error);
    throw error;
  }
}

export async function getWebhook(webhookId: string): Promise<any> {
  try {
    const response = await axios.get(`${HELIUS_API_URL}/webhooks/${webhookId}?api-key=${API_KEY}`);
    return response.data;
  } catch (error) {
    console.error('Error getting Helius webhook:', error);
    throw error;
  }
}