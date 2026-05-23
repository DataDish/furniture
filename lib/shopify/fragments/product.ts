import imageFragment from "./image";
import seoFragment from "./seo";

const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    metaTagline: metafield(namespace: "custom", key: "tagline") {
      value
      type
    }
    metaComparableAt: metafield(
      namespace: "custom"
      key: "comparable_at_price"
    ) {
      value
      type
    }
    metaComparableTo: metafield(namespace: "custom", key: "comparable_to") {
      value
      type
    }
    metaCategory: metafield(namespace: "custom", key: "category") {
      value
      type
    }
    metaSourcingStory: metafield(namespace: "custom", key: "sourcing_story") {
      value
      type
    }
    metaDesignStory: metafield(namespace: "custom", key: "design_story") {
      value
      type
    }
    metaCraftNotes: metafield(namespace: "custom", key: "craft_notes") {
      value
      type
    }
    metaFeatures: metafield(namespace: "custom", key: "features") {
      value
      type
    }
    metaMaterials: metafield(namespace: "custom", key: "materials") {
      value
      type
    }
    metaDimensions: metafield(namespace: "custom", key: "dimensions") {
      value
      type
    }
    metaCare: metafield(namespace: "custom", key: "care") {
      value
      type
    }
    metaLeadTime: metafield(namespace: "custom", key: "lead_time") {
      value
      type
    }
    metaRating: metafield(namespace: "custom", key: "rating") {
      value
      type
    }
    metaReviewCount: metafield(namespace: "custom", key: "review_count") {
      value
      type
    }
    metaReviews: metafield(namespace: "custom", key: "reviews") {
      value
      type
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
