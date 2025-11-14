import { Link } from 'react-router'

export default function HomePage() {
  return (
    <div className="h-screen px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      <div className="max-w-4xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Milk and Honey!
        </h1>
        <p className="text-xl text-grey-700 mb-8">
          beauty made simple and sweet
        </p>
        <Link
          to="/products"
          className="inline-block bg-rose-400 hover:bg-rose-600 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
        >
          Browse Products
        </Link>
      </div>
    </div>
  )
}
