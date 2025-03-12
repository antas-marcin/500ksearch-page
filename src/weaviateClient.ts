import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

// Types for our image objects
export interface ImageSearchResult {
  id: string;
  url?: string;
  image?: string;
  prompt?: string;
  height?: number;
  width?: number;
  sourceSite?: string;
  title?: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  _additional?: {
    distance?: number;
    id?: string;
  };
}

// Weaviate client configuration
let client: WeaviateClient | null = null;

export const initWeaviateClient = (
  scheme: string = 'https',
  host: string = 'localhost:8080',
  apiKey?: string
): WeaviateClient => {
  if (!client) {
    const clientConfig: any = {
      scheme,
      host,
    };

    if (apiKey) {
      clientConfig.apiKey = new ApiKey(apiKey);
    }

    client = weaviate.client(clientConfig);
  }
  
  return client;
};

// Function to perform natural language search
export const searchImages = async (
  query: string,
  className: string = 'DiffusionPrompt',
  limit: number = 12,
  offset: number = 0
): Promise<ImageSearchResult[]> => {
  if (!client) {
    throw new Error('Weaviate client not initialized');
  }

  try {
    // Using the newer Weaviate client API format with _additional fields inside withFields
    console.log("Executing text search query:", query, "with offset:", offset);
    const result = await client.graphql
      .get()
      .withClassName(className)
      .withFields(`prompt image height width sourceSite url _additional { id distance }`)
      .withNearText({
        concepts: [query],
        targetVectors: ["prompt"]
      })
      .withLimit(limit)
      .withOffset(offset)
      .do();
      
    console.log("Search results received:", result.data?.Get?.[className]?.length || 0, "items");

    if (result.data?.Get?.[className]) {
      return result.data.Get[className] as ImageSearchResult[];
    }

    return [];
  } catch (error) {
    console.error('Error searching images:', error);
    throw error;
  }
};

// Function to get all images (for initial loading)
export const searchImagesByObjectId = async (
  objectId: string,
  className: string = 'DiffusionPrompt',
  limit: number = 12,
  offset: number = 0
): Promise<ImageSearchResult[]> => {
  if (!client) {
    throw new Error('Weaviate client not initialized');
  }

  try {
    // Using the newer Weaviate client API format with _additional fields inside withFields
    console.log(`Executing nearObject search with object ID: ${objectId}`, "with offset:", offset);
    const result = await client.graphql
      .get()
      .withClassName(className)
      .withFields(`prompt image height width sourceSite url _additional { id distance }`)
      .withNearObject({
        id: objectId,
        targetVectors: ["image"]
      })
      .withLimit(limit)
      .withOffset(offset)
      .do();
      
    console.log("Similar objects search results received:", result.data?.Get?.[className]?.length || 0, "items");

    if (result.data?.Get?.[className]) {
      return result.data.Get[className] as ImageSearchResult[];
    }

    return [];
  } catch (error) {
    console.error('Error searching images by object ID:', error);
    throw error;
  }
};

export const searchImagesByImage = async (
  base64Image: string,
  className: string = 'DiffusionPrompt',
  limit: number = 12,
  offset: number = 0
): Promise<ImageSearchResult[]> => {
  if (!client) {
    throw new Error('Weaviate client not initialized');
  }

  try {
    // Using the newer Weaviate client API format with _additional fields inside withFields
    console.log("Executing image search query with uploaded image", "with offset:", offset);
    const result = await client.graphql
      .get()
      .withClassName(className)
      .withFields(`prompt image height width sourceSite url _additional { id distance }`)
      .withNearImage({
        image: base64Image,
        targetVectors: ["image"]
      })
      .withLimit(limit)
      .withOffset(offset)
      .do();
      
    console.log("Image search results received:", result.data?.Get?.[className]?.length || 0, "items");

    if (result.data?.Get?.[className]) {
      return result.data.Get[className] as ImageSearchResult[];
    }

    return [];
  } catch (error) {
    console.error('Error searching images by image:', error);
    throw error;
  }
};

export const getAllImages = async (
  className: string = 'DiffusionPrompt',
  limit: number = 12,
  offset: number = 0
): Promise<ImageSearchResult[]> => {
  if (!client) {
    throw new Error('Weaviate client not initialized');
  }

  try {
    // Using the newer Weaviate client API format
    console.log("Getting all images with offset:", offset);
    const result = await client.graphql
      .get()
      .withClassName(className)
      .withFields(`prompt image height width sourceSite url _additional { id }`)
      .withLimit(limit)
      .withOffset(offset)
      .do();

    if (result.data?.Get?.[className]) {
      return result.data.Get[className] as ImageSearchResult[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};