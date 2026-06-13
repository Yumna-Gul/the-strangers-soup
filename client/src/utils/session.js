import { v4 as uuidv4 } from 'uuid'

const VEGGIES = [
  'Potato', 'Carrot', 'Onion', 'Turnip', 'Parsnip',
  'Radish', 'Leek', 'Beetroot', 'Celery', 'Fennel',
  'Broccoli', 'Spinach', 'Cabbage', 'Garlic', 'Ginger',
  'Zucchini','Eggplant','Bell Pepper','Asparagus',
  'Brussels Sprout','Cauliflower', 'Kale', 'Collard Greens',
  'Swiss Chard', 'Artichoke','Mushroom', 'Okra', 'Pumpkin',
  'Squash', 'Sweet Potato','Yam', 'Watercress', 'Radicchio',
  'Endive', 'Bok Choy',
  'Napa Cabbage', 'Rutabaga', 'Sunchoke', 'Taro', 'Wasabi'
]

export function getSession() {
  let sessionId = localStorage.getItem('sessionId')
  
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem('sessionId', sessionId)
  }

  const index = parseInt(sessionId[0], 16) % VEGGIES.length
  const veggieName = 'User ' + VEGGIES[index]

  return { sessionId, veggieName }
}