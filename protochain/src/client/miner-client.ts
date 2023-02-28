import axios from 'axios';

const HOST = 'http://localhost:3000'

async function mine() {
  const { data } = await axios.get(`${HOST}/blocks/next`);
  console.log(data);
}

mine();
