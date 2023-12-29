const GetFileDocument = `
    query GetFile($expression: String!) {
    repository(owner: "strawberry-graphql", name: "strawberry") {
      object(expression: $expression) {
        ... on Blob {
          __typename
          text
        }
      }
    }
  }
`;

export const fetchDocPage = async ({
  filename,
  prNumber,
}: {
  filename: string;
  prNumber?: string;
}) => {
  const prefix = "main";

  let expression = `${prefix}:${filename}`;

  if (prNumber) {
    expression = `pull/${prNumber}/head:${filename}`;
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${import.meta.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query: GetFileDocument,
      variables: { expression },
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const content = await response.json();

  const { data } = content;

  if (!data) {
    throw new Error("No data returned");
  }

  return data.repository.object.text as string;
};
