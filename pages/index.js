import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api';
const coinGeckoClient = new CoinGecko();

export default function Home(props) {
  const { data } = props.result;
  
  const formatPercent = number => 
      `${new Number(number).toFixed(2)}%`

  const formatDollar = (number, maxSignificantDigits) =>
      new Intl.NumberFormat(
        'en-US',
        {
          style: 'currency',
          currency: 'usd',
          maxSignificantDigits
        })
        .format(number);

  return (
    <div className={styles.container}>
      <Head>
        <title> CoinMarketCap Top 100 Cryptocurrencies by Market Capitalization </title>
        <link rel="icon" href="/favicon.ico" />
        <h1> Coinmarketcap clone | Top 100 Cryptocurrencies by Market Capitalization </h1>
        <table className='table'>
         <thead>
          <tr>
             <th>Name</th>
            <th>Symbol</th>
            <th>24h Change</th>
            <th>Price</th>
            <th>Market cap</th>
          </tr>
         </thead>
         <tbody>
           {data.map(coin => (
             <tr key={coin.id}>
               <td>{coin.id}</td>
               <td>
                  <img 
                  src={coin.image}
                  style={{width: 25, height: 25, marginRight: 10}}
                  />
                  {coin.symbol.toUpperCase()}
               </td>
               <td>
                  <span
                    className={coin.price_change_percentage_24 > 0 ? (
                      'text-success') : 'text-danger'}
                  >
               {formatPercent(coin.price_change_percentage_24h)}
                  </span>
               </td>
               <td>{formatDollar(coin.current_price, 20)}</td>
               <td>{formatDollar(coin.market_cap, 12)}</td>
             </tr>
           ))}
         </tbody>
        </table>
      </Head>
    </div>
  )
}

export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  }
  const result = await coinGeckoClient.coins.markets({params});
  return {
    props: {
      result
    }
  }
}
