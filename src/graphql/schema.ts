import { gql } from '@apollo/client'; 

export const typeDefs = gql`
  enum Role {
    manager
    store_keeper
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: Role!
  }

  type KPI {
    id: ID!
    label: String!
    value: String!
    trend: Float!
    trendDirection: String!
  }

  type ChartDataset {
    label: String!
    data: [Float!]!
  }

  type ChartData {
    labels: [String!]!
    datasets: [ChartDataset!]!
  }

  type DashboardStats {
    kpis: [KPI!]!
    sales: ChartData!
    traffic: ChartData!
  }

  type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    quantity: Int!
    status: String
    lastUpdated: String
  }

  type Query {
    me: User
    products: [Product!]!
    product(id: ID!): Product
    dashboardStats: DashboardStats!
  }

  type Mutation {
    login(email: String!): User
    addProduct(
      name: String!
      category: String!
      price: Float!
      quantity: Int!
      status: String
    ): Product
    updateProduct(
      id: ID!
      name: String
      category: String
      price: Float
      quantity: Int
      status: String
    ): Product
    deleteProduct(id: ID!): Boolean
  }
`;
