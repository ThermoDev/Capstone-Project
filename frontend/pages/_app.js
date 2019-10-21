import App from 'next/app';
import Layout from '../components/Layout';
import { ProvideAuth } from '../lib/useAuth';

class MyApp extends App {
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

  // TODO: hide layout if user not logged in
  render() {
    const { Component, pageProps } = this.props;
    return (
      <ProvideAuth>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ProvideAuth>
    );
  }
}

export default MyApp;
