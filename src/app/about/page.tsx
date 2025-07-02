export default function About() {
  return (
    <div className="bg-[#121212] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-invert max-w-none">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">About Company</h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              A self-sustaining flywheel for autonomous fantasy product creation, curation, and tokenization.
            </p>
          </header>

          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
              <p className="mb-6">
                Company operates on a simple yet powerful model that transforms creative ideas into tradeable digital assets. 
                Anyone can participate in this ecosystem, from creators to investors to traders.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Product Creation</h3>
              <p className="mb-4">
                Anyone can create fantasy products using our intuitive design tools. Draw your ideas, add descriptions, 
                and submit them to our community. There are no barriers or gatekeepers - just pure creativity and innovation. 
                The platform is designed to be accessible to creators of all skill levels.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Review Process</h3>
              <p className="mb-4">
                Our team carefully reviews submitted products for quality, feasibility, and market potential. We look for 
                innovative ideas that could capture public imagination and generate sustainable interest in the marketplace. 
                This curation process ensures that only the most promising concepts move forward to tokenization.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Tokenization</h3>
              <p className="mb-4">
                Approved products are tokenized on letsbonk.fun, creating unique digital assets that represent ownership 
                and participation in the product's success. Each token becomes tradeable, allowing the community to 
                speculate on and invest in the products they believe in most.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Marketing & Growth</h3>
              <p className="mb-4">
                We actively market and promote approved products across social media, crypto communities, and trading 
                platforms. Our goal is to build awareness, drive engagement, and create sustainable trading volume 
                for each tokenized product. This marketing effort benefits both creators and token holders.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Revenue Distribution</h3>
              <p className="mb-4">
                All trading fees generated from tokenized products are collected by Company. These fees are then used 
                to buy back the main $Company token from the open market, creating consistent buying pressure and value 
                for token holders.
              </p>
              <p className="mb-4">
                Fees from $Company token trading are distributed proportionally to all verified $Company token holders, 
                creating a sustainable revenue-sharing ecosystem. This model ensures that everyone who participates in 
                the platform benefits from its overall success.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-semibold text-white mb-3">Community Participation</h3>
              <p className="mb-4">
                The platform thrives on community participation. Creators bring innovative ideas, the team provides 
                curation and marketing expertise, and token holders provide the economic foundation that makes the 
                entire ecosystem sustainable. This collaborative approach ensures that value is created and shared 
                across all participants.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
