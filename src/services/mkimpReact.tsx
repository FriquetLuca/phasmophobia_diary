import { type EmojiRecord, type MdToken, type RootToken } from 'mkimp';

type TokenType = MdToken['type'];
type ExtractToken<T extends TokenType> = Extract<
  MdToken,
  {
    type: T;
  }
>;
type TokenRendering = {
  [K in TokenType]: (
    this: Renderer,
    token: ExtractToken<K>
  ) => Promise<React.ReactNode>;
};
interface AbbrToken {
  type: 'abbr';
  abbr: string;
  title: string;
}
interface LinkRef {
  link: string;
  title: string | undefined;
}
const WHITESPACE_CHARS = new Set([
  '\u0009', // Tab
  '\u000B', // Vertical Tab
  '\u000C', // Form Feed
  '\u000D', // Carriage Return
  '\u0020', // Space
  '\u00A0', // No-Break Space
  '\u1680', // Ogham Space Mark
  '\u2000', // En Quad
  '\u2001', // Em Quad
  '\u2002', // En Space
  '\u2003', // Em Space
  '\u2004', // Three-Per-Em Space
  '\u2005', // Four-Per-Em Space
  '\u2006', // Six-Per-Em Space
  '\u2007', // Figure Space
  '\u2008', // Punctuation Space
  '\u2009', // Thin Space
  '\u200A', // Hair Space
  '\u2028', // Line Separator
  '\u2029', // Paragraph Separator
  '\u202F', // Narrow No-Break Space
  '\u205F', // Medium Mathematical Space
  '\u3000', // Ideographic Space
]);

function cleanUrl(href: string) {
  try {
    href = encodeURI(href).replace(/%25/g, '%');
  } catch {
    return null;
  }
  return href;
}

interface HeadingToken {
  type: 'heading';
  id: string | undefined;
  isUnderline: boolean;
  headingIndex: string;
  depth: number;
  tokens: MdToken[];
}

interface TOCNode {
  token: HeadingToken;
  children: TOCNode[];
}

async function renderTocNodes(
  this: Renderer,
  nodes: TOCNode[]
): Promise<React.ReactNode> {
  if (nodes.length === 0) return null;

  // We use Promise.all because the loop contains async calls
  const listItems = await Promise.all(
    nodes.map(async ({ token, children }) => {
      const content = await this.renderer(token.tokens);

      // Recursively render children nodes
      const nestedChildren = await renderTocNodes.call(this, children);

      return (
        <li key={token.id || token.headingIndex} role="listitem">
          {token.id && token.id.length > 0 ? (
            <a href={`#${token.id}`}>
              {token.headingIndex}
              {content}
            </a>
          ) : (
            <>
              {token.headingIndex}
              {content}
            </>
          )}
          {nestedChildren}
        </li>
      );
    })
  );

  return <ul role="list">{listItems}</ul>;
}

const RENDERER_FNS: TokenRendering = {
  async emoji(token) {
    const emoji = this.emojis[token.name];
    if (emoji === undefined) {
      return `:${token.name}:`;
    }
    switch (emoji.type) {
      case 'img':
        return (
          <img
            alt={emoji.alt ?? token.name}
            src={emoji.url}
            width={emoji.width ?? 20}
            height={emoji.height ?? 20}
          />
        );
      case 'i':
        return <i className={emoji.className}></i>;
      default:
        return emoji.char;
    }
  },
  async definitionListItem(token) {
    let definitions: React.ReactNode[] = [];
    for (const def of token.definitions) {
      definitions.push(<dd>{await this.renderer(def)}</dd>);
    }
    const term = await this.renderer(token.term);
    return (
      <>
        <dt>{term}</dt>
        {definitions}
      </>
    );
  },
  async heading(token) {
    const headingContent = await this.renderer(token.tokens);
    const createHeading = (children: React.ReactNode) => {
      switch (token.depth) {
        case 1:
          return (
            <h1 id={token.id} aria-level={token.depth}>
              {children}
            </h1>
          );
        case 2:
          return (
            <h2 id={token.id} aria-level={token.depth}>
              {children}
            </h2>
          );
        case 3:
          return (
            <h3 id={token.id} aria-level={token.depth}>
              {children}
            </h3>
          );
        case 4:
          return (
            <h4 id={token.id} aria-level={token.depth}>
              {children}
            </h4>
          );
        case 5:
          return (
            <h5 id={token.id} aria-level={token.depth}>
              {children}
            </h5>
          );
        default:
          return (
            <h6 id={token.id} aria-level={token.depth}>
              {children}
            </h6>
          );
      }
    };
    return createHeading(`${token.headingIndex}${headingContent}`);
  },
  async codeblock(token) {
    return (
      <pre role="region" aria-label="Code block">
        <code aria-label="Code">{token.content}</code>
      </pre>
    );
  },
  async horizontal(_) {
    return <hr role="separator" aria-hidden="true" />;
  },
  async blockquote(token) {
    return (
      <blockquote role="note" aria-label="A quote from the author">
        {await this.renderer(token.tokens)}
      </blockquote>
    );
  },
  async list(token) {
    const generateList = (child: React.ReactNode) => {
      if (token.ordered) {
        return (
          <ol
            role="list"
            start={
              token.startAt !== undefined ? Number(token.startAt) : undefined
            }
          >
            {child}
          </ol>
        );
      }
      return <ul role="list">{child}</ul>;
    };
    return generateList(await this.renderer(token.items));
  },
  async listItem(token) {
    const head = token.task ? (
      <input type="checkbox" disabled={true} checked={token.checked} />
    ) : undefined;
    const body = await this.renderer(token.tokens);
    return (
      <li role="listitem">
        {head}
        {body}
      </li>
    );
  },
  async table(token) {
    const header = (
      <thead role="rowgroup">
        <tr>{await this.renderer(token.header)}</tr>
      </thead>
    );
    const body: React.ReactNode[] = [];
    for (const cells of token.rows) {
      body.push(<tr>{await this.renderer(cells)}</tr>);
    }
    return (
      <table role="table">
        {header}
        <tbody role="rowgroup">{body}</tbody>
      </table>
    );
  },
  async cell(token) {
    if (token.header) {
      return (
        <th
          style={
            token.align !== 'default' ? { textAlign: token.align } : undefined
          }
        >
          {await this.renderer(token.tokens)}
        </th>
      );
    } else {
      return (
        <td
          style={
            token.align !== 'default' ? { textAlign: token.align } : undefined
          }
        >
          {await this.renderer(token.tokens)}
        </td>
      );
    }
  },
  async footnoteRef(token) {
    return (
      <sup id={`fnref:${token.ref}`}>
        <a
          href={`#fn:${token.ref}`}
        >{`[${this.footnoteIndexRefs.get(token.ref) ?? -1}]`}</a>
      </sup>
    );
  },
  async footnoteEnd(_) {
    let result: React.ReactNode[] = [];
    const refSize = this.footnoteRefs.size;
    for (let i = 1; i <= refSize; i++) {
      const ref = this.footnoteRefs.get(i)!;
      const def = this.footnoteDefs.get(ref);
      if (def !== undefined) {
        result.push(<li id={`fn:${ref}`}>{await this.renderer(def)}</li>);
      } else {
        result.push(<li id={`fn:${ref}`}>[${ref}]</li>);
      }
    }
    return (
      <section>
        <ol dir="auto">{result}</ol>
      </section>
    );
  },
  async definitionList(token) {
    return <dl>{await this.renderer(token.items)}</dl>;
  },
  async tex() {
    return undefined;
  },
  async spoiler() {
    return undefined;
  },
  async include(token) {
    return await this.renderer(token.tokens);
  },
  async html(token) {
    return <span dangerouslySetInnerHTML={{ __html: token.content }} />;
  },
  async paragraph(token) {
    return <p>{await this.renderer(token.tokens)}</p>;
  },
  async overline(token) {
    return (
      <u style={{ textDecoration: 'overline' }}>
        {await this.renderer(token.tokens)}
      </u>
    );
  },
  async newline() {
    return <br />;
  },
  async highlight(token) {
    return (
      <mark style={{ backgroundColor: '#fdf5ce' }}>
        {await this.renderer(token.tokens)}
      </mark>
    );
  },
  async strikethrough(token) {
    return <del>{await this.renderer(token.tokens)}</del>;
  },
  async underline(token) {
    return (
      <u style={{ textDecoration: 'underline' }}>
        {await this.renderer(token.tokens)}
      </u>
    );
  },
  async bold(token) {
    return <strong>{await this.renderer(token.tokens)}</strong>;
  },
  async italic(token) {
    return <em>{await this.renderer(token.tokens)}</em>;
  },
  async text(token) {
    if (!this.abbrs || this.abbrs.length === 0) {
      return token.text;
    }
    const result: React.ReactNode[] = [];
    let textResult = '';
    let i = 0;
    while (i < token.text.length) {
      let found = false;
      while (i < token.text.length) {
        // Consume whitespaces
        if (!WHITESPACE_CHARS.has(token.text[i])) {
          break;
        }
        textResult += token.text[i++];
      }
      for (const abbr of this.abbrs) {
        // Search abbr
        const sbr = token.text.slice(i, i + abbr.abbr.length);
        if (
          sbr === abbr.abbr &&
          (i + abbr.abbr.length === token.text.length ||
            (i + abbr.abbr.length < token.text.length &&
              WHITESPACE_CHARS.has(token.text[i + abbr.abbr.length])))
        ) {
          // If found, consume it
          if (textResult.length > 0) {
            result.push(textResult);
            textResult = '';
          }
          result.push(<abbr title={abbr.title}>{sbr}</abbr>);
          found = true;
          i += abbr.abbr.length;
          break;
        }
      }
      if (!found) {
        // if not found
        let startIndex = i;
        while (i < token.text.length) {
          // search next whitespace
          if (WHITESPACE_CHARS.has(token.text[i])) {
            break;
          }
          i++;
        }
        textResult += token.text.slice(startIndex, i);
      }
    }
    if (textResult.length > 0) {
      result.push(textResult);
      textResult = '';
    }
    return result;
  },
  async codespan(token) {
    return <code aria-label="Code">{token.text}</code>;
  },
  async youtubeEmbed() {
    return undefined;
  },
  async metadata(token) {
    if (token.value) {
      return typeof token.value === 'string'
        ? token.value
        : token.value.toString();
    }
    return '';
  },
  async link(token) {
    const linkText = await this.renderer(token.label);
    const cleanHref = cleanUrl(token.href);
    if (cleanHref === null) {
      return linkText;
    }
    if (cleanHref.startsWith('#')) {
      return (
        <a href={cleanHref} title={token.title}>
          {linkText}
        </a>
      );
    }
    return (
      <a href={cleanHref} title={token.title} target="_blank" rel="noopener">
        {linkText}
      </a>
    );
  },
  async reflink(token) {
    const reflinkText = await this.renderer(token.label);
    const refLink = this.reflinks.get(token.ref);
    if (refLink) {
      const cleanHref = cleanUrl(refLink.link);
      if (cleanHref === null) {
        return reflinkText;
      }
      if (cleanHref.startsWith('#')) {
        return (
          <a href={cleanHref} title={refLink.title}>
            {reflinkText}
          </a>
        );
      }
      return (
        <a
          href={cleanHref}
          title={refLink.title}
          target="_blank"
          rel="noopener"
        >
          {reflinkText}
        </a>
      );
    }
    return reflinkText;
  },
  async image(token) {
    const imgcleanHref = cleanUrl(token.href);
    if (imgcleanHref === null) {
      return token.alt;
    }
    return <img src={imgcleanHref} alt={token.alt} title={token.title} />;
  },
  async tableOfContent(_) {
    const root: TOCNode[] = [];
    const stack: { depth: number; node: TOCNode }[] = [];

    for (const token of this.tableOfContents) {
      const node: TOCNode = { token, children: [] };

      while (stack.length > 0 && stack[stack.length - 1].depth >= token.depth) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].node.children.push(node);
      }

      stack.push({ depth: token.depth, node });
    }

    return await renderTocNodes.call(this, root);
  },
};
type RenderTarget = 'article' | 'raw';
export interface RendererOptions {
  withSection: boolean;
  renderTarget: RenderTarget;
}
export class Renderer {
  metadata: Map<string, string | number | boolean | BigInt>;
  reflinks: Map<string, LinkRef>;
  footnoteDefs: Map<string, MdToken[]>;
  footnoteIndexRefs: Map<string, number>;
  footnoteRefs: Map<number, string>;
  tableOfContents: HeadingToken[];
  abbrs: AbbrToken[];
  tokens: MdToken[];
  emojis: Record<string, EmojiRecord>;
  withSection: boolean;
  renderTarget: RenderTarget;
  constructor(root: RootToken, options: Partial<RendererOptions> = {}) {
    this.emojis = root.emojis;
    this.metadata = root.metadata;
    this.reflinks = root.reflinks;
    this.footnoteDefs = root.footnoteDefs;
    this.footnoteRefs = root.footnoteRefs;
    this.tokens = root.tokens;
    this.footnoteIndexRefs = root.footnoteIndexRefs;
    this.tableOfContents = root.tableOfContents;
    this.abbrs = root.abbrs;
    this.withSection = options?.withSection ?? false;
    this.renderTarget = options?.renderTarget ?? 'raw';
  }
  async render() {
    const content = await this.renderer(this.tokens);
    switch (this.renderTarget) {
      case 'article':
        return (
          <article role="document" aria-label="Page content">
            {content}
          </article>
        );
      case 'raw':
        return content;
    }
  }
  async renderer(tokens: MdToken[]): Promise<React.ReactNode> {
    if (!this.withSection) {
      const result: React.ReactNode[] = [];
      for (const token of tokens) {
        result.push(await RENDERER_FNS[token.type].call(this, token as any));
      }
      return result;
    }

    // Group tokens into sections based on headings
    const sections: MdToken[][] = [];
    let currentSection: MdToken[] = [];
    for (const token of tokens) {
      if (token.type === 'heading') {
        if (currentSection.length > 0) {
          sections.push(currentSection);
        }
        currentSection = [token];
      } else {
        currentSection.push(token);
      }
    }
    if (currentSection.length > 0) {
      sections.push(currentSection);
    }

    const result: React.ReactNode[] = [];
    for (const sectionTokens of sections) {
      const headingToken = sectionTokens.find((t) => t.type === 'heading');
      const headingId = headingToken ? headingToken.id : undefined;

      let inner: React.ReactNode[] = [];
      for (const token of sectionTokens) {
        inner.push(await RENDERER_FNS[token.type].call(this, token as any));
      }

      if (headingId) {
        result.push(
          <section role="region" aria-labelledby={headingId}>
            {inner}
          </section>
        );
      } else {
        result.push(<section>{inner}</section>);
      }
    }
    return result;
  }
}
