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
    metaTagline: metafield(namespace: "details", key: "tagline") {
      value
      type
    }
    metaCategory: metafield(namespace: "details", key: "category") {
      value
      type
    }
    metaDesignStory: metafield(namespace: "details", key: "design_story") {
      value
      type
    }
    metaCraftNotes: metafield(namespace: "details", key: "craft_notes") {
      value
      type
    }
    metaFeatures: metafield(namespace: "details", key: "features") {
      value
      type
    }
    metaCare: metafield(namespace: "details", key: "care") {
      value
      type
    }
    metaLeadTime: metafield(namespace: "details", key: "lead_time") {
      value
      type
    }
    metaRating: metafield(namespace: "details", key: "rating") {
      value
      type
    }
    metaReviewCount: metafield(namespace: "details", key: "review_count") {
      value
      type
    }
    metaReviews: metafield(namespace: "details", key: "reviews") {
      value
      type
    }
    metaComparableAt: metafield(
      namespace: "sourcing"
      key: "comparable_at_price"
    ) {
      value
      type
    }
    metaComparableTo: metafield(namespace: "sourcing", key: "comparable_to") {
      value
      type
    }
    metaSourcingStory: metafield(namespace: "sourcing", key: "story") {
      value
      type
    }
    metaMaterials: metafield(namespace: "specs", key: "materials") {
      value
      type
    }
    metaDimensions: metafield(namespace: "specs", key: "dimensions") {
      value
      type
    }
    metaReviewsRating: metafield(namespace: "reviews", key: "rating") {
      value
      type
    }
    metaReviewsCount: metafield(namespace: "reviews", key: "rating_count") {
      value
      type
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default productFragment;
