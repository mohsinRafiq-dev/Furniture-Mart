export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Orders
            </h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Revenue
            </h3>
            <p className="text-3xl font-bold text-gray-900">$0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Products
            </h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Customers
            </h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Orders
          </h2>
          <p className="text-gray-600">No orders yet.</p>
        </div>
      </div>
    </div>
  );
}
