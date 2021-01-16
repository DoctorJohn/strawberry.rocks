/** @jsx jsx */
import { Box, Link as ThemeLink } from "@theme-ui/components";
import { jsx } from "theme-ui";

import NextLink from "next/link";
import { useRouter } from "next/router";

import { ExternalIcon } from "./icons/external";

type LinkProps = {
  href: string;
  variant?: string;
  as?: string;
  target?: string;
  hideExternalIcon?: boolean;
  partialMatch?: boolean;
  rel?: string;
};

function LinkWrapper({
  href,
  isExternal,
  children,
  as,
  partialMatch = false,
  ...rest
}: {
  href: string;
  as?: string;
  isExternal: boolean;
  partialMatch?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  if (isExternal) {
    return (
      <ThemeLink {...rest} href={href}>
        {children}
      </ThemeLink>
    );
  }

  const match = (a: string, b: string) => {
    if (partialMatch && b) {
      return a.startsWith(b);
    }

    return a == b;
  };

  const isActive = match(router.asPath, as) || match(router.asPath, href);

  let className = rest.className || "";

  if (isActive) {
    className = `${className} active`;
  }

  return (
    <NextLink href={href} as={as} passHref>
      <ThemeLink {...rest} className={className}>
        {children}
      </ThemeLink>
    </NextLink>
  );
}

export const Link: React.SFC<LinkProps> = ({
  children,
  href,
  hideExternalIcon = false,
  ...props
}) => {
  const isExternal = href.startsWith("http");

  if (props.target == "_blank") {
    props.rel = "noopener noreferrer";
  }

  return (
    <LinkWrapper isExternal={isExternal} {...props} href={href}>
      <Box as="span" sx={{ mr: isExternal ? 1 : 0 }}>
        {children}
      </Box>

      {isExternal && !hideExternalIcon && (
        <ExternalIcon
          width="1em"
          sx={{ verticalAlign: "middle", fill: "currentColor" }}
        />
      )}
    </LinkWrapper>
  );
};
