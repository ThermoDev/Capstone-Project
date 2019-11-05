import App from 'next/app';
import Layout from '../components/Layout';
import { AuthProvider } from '../lib/useAuth';
import { ApiProvider } from '../lib/useApi';

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

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AuthProvider>
        <ApiProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ApiProvider>
      </AuthProvider>
    );
  }
}

export default MyApp;
