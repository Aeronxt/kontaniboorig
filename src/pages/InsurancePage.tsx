import React from 'react';

const InsurancePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-green-600 text-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Compare Insurance Plans and Save
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-6">
              Find the best insurance coverage for your needs and budget. Compare top providers side by side.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="btn bg-white text-green-600 hover:bg-green-50">
                Compare Auto Insurance
              </button>
              <button className="btn bg-green-700 text-white hover:bg-green-800">
                View Health Plans
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InsurancePage;