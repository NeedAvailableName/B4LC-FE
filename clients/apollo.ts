import { ApolloClient as Apollo, InMemoryCache } from "@apollo/client";
import { SUB_GRAPH_URL } from "../app-configs";

const ApolloClient = new Apollo({
  uri: SUB_GRAPH_URL,
  cache: new InMemoryCache(),
});

export default ApolloClient;