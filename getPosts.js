const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * Formatar datas e horários
 * https://www.alura.com.br/artigos/formatar-datas-horas-moedas-javascript
 */

function getPostsInfo(html) {
  function getSitename(html) {
    let siteName = html.querySelector('meta[property="og:site_name"]')?.content?.
      toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('ê')
      .join('e')
      .split('ô')
      .join('o')
      .split('|')
      .join('');
    if (siteName) return siteName;
    
    siteName = html.querySelector('meta[name="twitter:creator"]')?.getAttribute('content')?.
      replace('@', '')
      .toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('ê')
      .join('e')
      .split('ô')
      .join('o')
      .split('|')
      .join('');
    if (siteName) return siteName;
    
    siteName = html.querySelector('meta[name="twitter:site"]')?.getAttribute('content')?.
      replace('@', '')
      .toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('ê')
      .join('e')
      .split('ô')
      .join('o')
      .split('|')
      .join('');
    if (siteName) return siteName;
    
    siteName = html.querySelector('meta[property="og:title"]')?.getAttribute('content')?.
      toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('ê')
      .join('e')
      .split('ô')
      .join('o')
      .split('|')
      .join('');
    if (siteName) return siteName;

    siteName = html.querySelector('link[rel="canonical"]')?.href
      .split('.com')[0]
      .split('//')[1]
      .replace('www.', '');
    if (siteName) return siteName;

    siteName = html.querySelector('link[type="application/rss+xml"]')?.getAttribute('title')?.
      toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('|')
      .join('');
    if (siteName) return siteName;

    return null;
  }

  function getPostsSelector(html) {
    const map = {
      'alura': '.article__item',
      'agenciamestre': '.listagem-posts .info-post',
      'csstricks': 'article.article-card',
      'joshwcomeau': 'main article',
      'lucassantos': '.post-card',
      'blogrdstation': '.post-list li',
      'rockcontentbr': '.rock-grid .rock-grid__item',
      'shopify': '.article--index',
      'smashingmagazine': '.article--post',
      'tabnews': 'article[class*="Box"]',
      'wsvincent': '.post-list li',
      'devmedia': '.lista-cursos-box1 .list-item',
      'emersonbroga': 'article.card-blog',
      'felipefialhorssfeed': '[class*="styled__BlogItem"]',
      'gabsferreira': 'ol.posts li',
      'khalilstemmler': '.article-card:not(:empty)',
      'kentcdodds': '.col-span-4.mb-10, .relative.grid.grid-cols-4.gap-x-4.mx-auto.max-w-7xl.group.rounded-lg.pb-6.pt-14',
      'lambda3': '.post-item.item',
      'neilpatel': '.post-first.hentry, .post.type-post.status-publish',
      'reinaldoferraz': 'article.post',
      'blogdarocketseat': 'article.m-featured-article, article.m-article-card.post',
      'tableless': '.tb-list-all-posts .tb-list-item',
      'viverdeblog': '.featured-posts .col-md-6.col-sm-12, .vdb-card.simple',
      'willianjusten': '[class*="styled__PostLink"]',
      'tdcblog': '.post-outer-container',
      'wkjobhub': '.post-list-item'
    };

    return map[getSitename(html)];
  }

  function getTitle(postElement) {
    let title = postElement.querySelector('h1')?.innerText;
    if (title) return title;

    title = postElement.querySelector('h2')?.innerText;
    if (title) return title;

    title = postElement.querySelector('h3')?.innerText;
    if (title) return title;

    title = postElement.querySelector('h4')?.innerText;
    if (title) return title;

    title = postElement.querySelector('h5')?.innerText;
    if (title) return title;

    title = postElement.querySelector('.article-card--title')?.innerText;
    if (title) return title;

    title = postElement.querySelector('a')?.innerText;
    if (title) return title;

    title = postElement.querySelector('.font-medium.text-black')?.innerText;
    if (title) return title;

    return null;
  }

  function getDescription(postElement) {
    let description = postElement.querySelector('.desc-post')?.innerText;
    if (description) return description;

    description = postElement.querySelector('.card-content')?.innerText;
    if (description) return description;

    description = postElement.querySelector('.hero-subheadline')?.innerText;
    if (description) return description;

    description = postElement.querySelector('h3')?.nextElementSibling?.innerText;
    if (description) return description;

    description = postElement.querySelector('[class*="excerpt"]')?.innerText;
    if (description) return description;

    description = postElement.querySelector('.article--post__teaser')?.innerText;
    if (description) return description;

    description = postElement.querySelector('.container.post-body.entry-content')?.innerText;
    if (description) return description;

    description = postElement.querySelector('[class*="description"]')?.innerText;
    if (description) return description;

    description = postElement.querySelector('[class*="styled__Subtitle"]')?.innerText;
    if (description) return description;

    description = postElement.querySelector('p')?.innerText;
    if (description) return description;

    description = document.querySelector('h2')?.nextElementSibling?.innerText;
    if (description) return description;

    description = document.querySelector('h2')?.innerText;
    if (description) return description;

    return null;
  }

  function getThumbnail(postElement) {
    let thumbnail = postElement.querySelector('.article__image')?.style.backgroundImage.split('"')[1];
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.image-wrapper')?.style.backgroundImage.split('"')[1];
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.wp-post-image')?.dataset?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.wp-post-image')?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.post-card-image')?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.entered.lazyloaded')?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.snippet-thumbnail-img')?.style.backgroundImage.split('"')[1];
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('img')?.srcset;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('img')?.dataset.srcset;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('img')?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.transition-opacity')?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('a')?.href;
    if (thumbnail) return thumbnail;

    let url = postElement.querySelector('a')?.href;
    if (url?.includes('joshwcomeau')) return 'https://www.joshwcomeau.com/assets/me-light.webp';

    let siteName = html.querySelector('meta[property="og:site_name"]')?.content;
    if (siteName === 'Gabs Ferreira') return 'http://gabsferreira.com/content/images/2021/03/159618622_3758044027596962_8077086665797277201_n.jpg';

    siteName = html.querySelector('meta[property="twitter:site"]')?.content;
    if (siteName === 'tableless') return 'https://tableless.com.br/images/logo.svg';

    siteName = html.querySelector('meta[property="og:site_name"]')?.content;
    if (siteName === 'Willian Justen') return 'https://willianjusten.com.br/_next/image?url=https%3A%2F%2Favatars.githubusercontent.com%2Fu%2F3991845%3Fv%3D4&w=64&q=75';

    return null;
  }

  function getUrl(postElement) {
    let url = postElement.querySelector('a')?.href;
    if (url) return url;

    url = postElement.href;
    if (url) return url;

    return null;
  }

  // function getDate(postElement) {
  //   let date = postElement.querySelector('time')?.getAttribute('datetime');
  //   if (date) return date;

  //   date = postElement.querySelector('time')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.post-meta')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.artigo-date')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.post-footer-value')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.m-article-card__timestamp > span:first-child')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.m-featured-article__timestamp > span:first-child')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.mt-6.text-xl.font-medium.text-slate-500')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('.mt-8.text-xl.font-medium.text-slate-500')?.innerText;
  //   if (date) return date;

  //   date = postElement.querySelector('small > i:first-child')?.innerText;
  //   if (date) return date;

  //   return null;
  // }

  function getOwner(html) {
    let owner = html.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    if (owner) return owner;

    owner = html.querySelector('meta[name="twitter:creator"]')?.getAttribute('content')?.replace('@', '');
    if (owner) return owner;

    owner = html.querySelector('link[rel="canonical"]')?.href
      .split('.com')[0]
      .split('//')[1]
      .replace('www.', '');
    if (owner) return owner;

    owner = html.querySelector('link[type="application/rss+xml"]')?.getAttribute('title')?.
      toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('|')
      .join('');
    if (owner) return owner;

    owner = html.querySelector('meta[name="og:title"]')?.getAttribute('content')?.
      toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('ê')
      .join('e')
      .split('ô')
      .join('o')
      .split('|')
      .join('');
    if (owner) return owner;
    
    owner = html.querySelector('meta[name="twitter:site"]')?.getAttribute('content')?.replace('@', '')
    if (owner) return owner;

    return null;
  }

  const postsSelector = getPostsSelector(html);
  const postsElement = [ ...html.querySelectorAll(postsSelector) ];
  const postsQuantity = 20;
  
  return postsElement
    .slice(0,postsQuantity)
    .map(postElement => {
      const title = getTitle(postElement);
      const description = getDescription(postElement);
      const thumbnail = getThumbnail(postElement);
      const url = getUrl(postElement);
      // const date = getDate(postElement);
      const owner = getOwner(html);
      
      return {
        title,
        description,
        thumbnail,
        url,
        // date,
        owner
      };
    });
}

(async () => {
  // console.clear();
  // let time = 0;
  console.time();
  // const interval = setInterval(() => {
  //   time++;

  //   if (time < 60) {
  //     console.log(`${time} seconds`);
  //     return;
  //   }
    
  //   const minutes = Math.floor(time / 60);
  //   console.log(`${minutes} minute and ${time - (minutes * 60)} seconds`);
  // }, 1000);

  // const browser = await puppeteer.launch({ headless: false });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const blogsUrl = [
    'https://www.alura.com.br/artigos/front-end',
    'https://www.alura.com.br/artigos/programacao',
    // 'https://www.agenciamestre.com/categoria/seo/',
    // 'https://www.agenciamestre.com/categoria/redes-sociais/',
    // 'https://www.agenciamestre.com/categoria/marketing-de-conteudo/',
    // 'https://www.agenciamestre.com/categoria/geral/',
    // 'https://www.agenciamestre.com/categoria/ferramentas/',
    // 'https://css-tricks.com/',
    // 'https://www.joshwcomeau.com/latest/',
    // 'https://blog.lsantos.dev/',
    // 'https://blog.rdstation.com/',
    // 'https://rockcontent.com/br/blog/recentes/',
    // 'https://shopify.engineering/',
    // 'https://www.smashingmagazine.com/articles/',
    // 'https://www.tabnews.com.br/',
    // 'https://wsvincent.com/',
    // 'https://www.devmedia.com.br/artigos/',
    // 'https://emersonbroga.com/',
    // 'https://www.felipefialho.com/blog/',
    // 'http://gabsferreira.com/#open',
    // 'https://khalilstemmler.com/articles',
    // 'https://kentcdodds.com/blog',
    // 'https://www.lambda3.com.br/blog/',
    // 'https://reinaldoferraz.com.br/',
    // 'https://blog.rocketseat.com.br/',
    // 'https://tableless.com.br/todos-os-posts/',
    // 'https://viverdeblog.com/blog',
    // 'https://willianjusten.com.br/',
    // 'https://blog.thedevconf.com/',
    // 'https://wkrh.com.br/blog/',
    // 'https://neilpatel.com/br/blog/',
  ];

  // Ler arquivos oldPosts.json e newPosts.json
  // Colocar o conteúdo deles na const oldPosts
  const oldPosts = [];
  [ 'oldPosts.json', 'newPosts.json'].forEach(file => {
    fs.readFile(file, null, (error, data) => {
      if (error) throw new Error('Something went wrong:', error);
      oldPosts.push(...JSON.parse(data));
    });
  });

  const newPosts = [];

  for (let i = 0; i < blogsUrl.length; i++) {
    console.log(' ');
    console.log(`Starting URL: ${blogsUrl[i]}`);
    console.log(`URL: ${i + 1} of ${blogsUrl.length}`);
    console.log(' ');
    // await page.setDefaultNavigationTimeout(0);
    await page.goto(blogsUrl[i]);
    const postsInfo = await page.$eval('html', getPostsInfo);
    newPosts.push(...postsInfo);
    console.log(' ');
    console.log(`Finished URL: ${blogsUrl[i]}`);
    console.log(`URL: ${i + 1} of ${blogsUrl.length}`);
    console.log(' ');
    console.log('---');
  }
  
  // Todos os itens presentes nas duas listas, remove do newPosts
  // for (let i = 0; i < oldPosts.length; i++) {
  //   const currentOldPostTitle = oldPosts[i].title;
  //   const repeatedPostInNewPosts = newPosts.find(
  //     post => post.title === currentOldPostTitle
  //   );

  //   if (repeatedPostInNewPosts) {
  //     const itemToRemoveIndex = newPosts.indexOf('');
  //     const firstPartList = newPosts.slice(0, itemToRemoveIndex);
  //     const lastPartList = newPosts.slice(itemToRemoveIndex+1, newPosts.length);
  //     const newList = [ ...firstPartList, ...lastPartList]
  //   }
  // }

  fs.writeFile(
    './newPosts.json',
    JSON.stringify(newPosts, null, 2),
    error => {
      if (error) throw new Error('Something went wrong:', error);
    }
  );

  // clearInterval(interval);
  console.log('Finished!');
  console.log('Total posts:', newPosts.length);
  
  await browser.close();
  console.timeEnd();
})();
