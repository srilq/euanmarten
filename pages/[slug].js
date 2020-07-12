import { useState } from 'react';
import { promises as fs } from 'fs';
import { splitArrayAlternating } from '../utils/arrays';
import Image from '../components/Image';
import ColumnLayout from '../components/ColumnLayout';
import Lightbox from '../components/Lightbox';

const THUMBNAIL_COLUMNS = 2;
const THUMBNAIL_PADDING = 1;

const Thumbnail = ({ image, renditions, onClick }) => (
  <div className="Thumbnail mb2">
    <button
      title="View Image"
      type="button"
      className="button-reset bn pa0 db w-100 pointer"
      onClick={onClick}
    >
      <Image image={image} renditions={renditions} width="50vw" className="w-100 db" />
    </button>
  </div>
);

const ThumbnailColumn = ({ items, images, renditions, setLightboxImage }) => (
  <div>
    {items.map(item => {
      const image = images.find(data => data.filename === item.filename);

      return (
        <Thumbnail
          key={image.filename}
          image={image}
          renditions={renditions}
          onClick={() => setLightboxImage(image)}
        />
      );
    })}
  </div>
);

const Portfolio = ({ data: { items, images, renditions } }) => {
  const [lightboxImage, setLightboxImage] = useState(null);

  const isLightboxOpen = !!lightboxImage;

  const itemColumns = splitArrayAlternating(items, THUMBNAIL_COLUMNS);

  return (
    <main>
      <ColumnLayout
        columns={THUMBNAIL_COLUMNS}
        verticalPadding={THUMBNAIL_PADDING}
        horizontalPadding={THUMBNAIL_PADDING}
      >
        {itemColumns.map((items, i) => (
          <ThumbnailColumn
            key={i}
            items={items}
            images={images}
            renditions={renditions}
            setLightboxImage={setLightboxImage}
          />
        ))}
      </ColumnLayout>
      <Lightbox
        isOpen={isLightboxOpen}
        image={lightboxImage}
        renditions={renditions}
        onClose={() => setLightboxImage(null)}
      />
    </main>
  );
};

export const getStaticProps = async ({ params }) => {
  const imagesData = await fs.readFile('./images.json', { encoding: 'utf-8' });
  const parsedImagesData = JSON.parse(imagesData);

  const { portfolios, images, renditions } = parsedImagesData;

  const portfolioData = portfolios.find(portfolio => portfolio.slug === params.slug);

  const items = portfolioData.items;

  return {
    props: {
      data: {
        items,
        images,
        renditions,
      }
    }
  };
};

export const getStaticPaths = async () => {
  const imagesData = await fs.readFile('./images.json', { encoding: 'utf-8' });
  const parsedImagesData = JSON.parse(imagesData);

  const paths = parsedImagesData.portfolios.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

export default Portfolio;