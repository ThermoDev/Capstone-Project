import App from 'next/app';
import Layout from '../components/Layout';
// import withData from '../lib/withData'; // replace with redux later

// This is where you include your redux or apollo store if you want state to persist between pages.
class MyApp extends App {
  // Fires our queries and mutations before the first render of our components.
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    // Crawls all our pages and fetches data
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // This exposes the query to the user ie. shit in the address bar
    pageProps.query = ctx.query;
    // gets the data and stores it in the component's props
    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
// export default withData(MyApp);
