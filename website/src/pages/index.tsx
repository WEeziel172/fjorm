import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'

export default function Home(): JSX.Element {
  return (
    <Layout>
      <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Fjorm</h1>
        <p>Modular drag-and-drop form builder for React.</p>
        <Link className="button button--primary button--lg" to="/intro">
          Get started
        </Link>
      </div>
    </Layout>
  )
}
