/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type PageQueryInfo = {
    first?: number | null;
    after?: string | null;
    last?: number | null;
    before?: string | null;
};
export type searchProviderAllQueryVariables = {
    pageQueryInfo?: PageQueryInfo | null;
};
export type searchProviderAllQueryResponse = {
    readonly firmHarmCases: {
        readonly edges: ReadonlyArray<{
            readonly cursor: string;
            readonly node: {
                readonly accountId: string | null;
                readonly telNumber: string | null;
                readonly reason: string | null;
            };
        } | null> | null;
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly hasPreviousPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
    };
};
export type searchProviderAllQuery = {
    readonly response: searchProviderAllQueryResponse;
    readonly variables: searchProviderAllQueryVariables;
};



/*
query searchProviderAllQuery(
  $pageQueryInfo: PageQueryInfo
) {
  firmHarmCases(pageQueryInfo: $pageQueryInfo) {
    edges {
      cursor
      node {
        accountId
        telNumber
        reason
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "pageQueryInfo"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "pageQueryInfo",
        "variableName": "pageQueryInfo"
      }
    ],
    "concreteType": "FirmHarmCaseConnection",
    "kind": "LinkedField",
    "name": "firmHarmCases",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "FirmHarmCaseEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cursor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FirmHarmCase",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "accountId",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "telNumber",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "reason",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PageInfo",
        "kind": "LinkedField",
        "name": "pageInfo",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasNextPage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasPreviousPage",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startCursor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "endCursor",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "searchProviderAllQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "searchProviderAllQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "08f6c6ad6d045a8393c83643e9d3f9ef",
    "id": null,
    "metadata": {},
    "name": "searchProviderAllQuery",
    "operationKind": "query",
    "text": "query searchProviderAllQuery(\n  $pageQueryInfo: PageQueryInfo\n) {\n  firmHarmCases(pageQueryInfo: $pageQueryInfo) {\n    edges {\n      cursor\n      node {\n        accountId\n        telNumber\n        reason\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'f44104ad5f8fb20b12327b983e3e7026';
export default node;
