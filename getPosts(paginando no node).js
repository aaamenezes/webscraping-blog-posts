const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * Formatar datas e horários
 * https://www.alura.com.br/artigos/formatar-datas-horas-moedas-javascript
 */

function getPostsInfo(html) {
  const postsSelector = getPostsSelector(html)

  function getPostsSelector(html) {
    const siteName = html.querySelector('meta[property="og:site_name"')?.content?.
      toLowerCase()
      .trim()
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split('ê')
      .join('e');

    const map = {
      'alura': '.article__item',
      'agenciamestre': '.listagem-posts .info-post',
      'csstricks': 'article.article-card'
    };

    return map[siteName];
  }

  function getTitle(postElement) {
    let title = postElement.querySelector('h2')?.innerText;
    if (title) return title;

    return null;
  }

  function getDescription(postElement) {
    let description = postElement.querySelector('.desc-post')?.innerText;
    if (description) return description;

    description = postElement.querySelector('.card-content')?.innerText;
    if (description) return description;

    return null;
  }

  function getThumbnail(postElement) {
    let thumbnail = postElement.querySelector('.article__image')?.style.backgroundImage.split('"')[1];
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.wp-post-image')?.dataset?.src;
    if (thumbnail) return thumbnail;

    thumbnail = postElement.querySelector('.wp-post-image')?.src;
    if (thumbnail) return thumbnail;

    return null;
  }

  function getDate(postElement) {
    let date = postElement.querySelector('time')?.getAttribute('datetime');
    if (date) return date;

    date = postElement.querySelector('time')?.innerText;
    if (date) return date;

    return null;
  }

  const postsElement = [ ...html.querySelectorAll(postsSelector) ];

  return postsElement.map(postElement => {
    const title = getTitle(postElement);
    const description = getDescription(postElement);
    const thumbnail = getThumbnail(postElement);
    const date = getDate(postElement);
    const owner = html.querySelector('meta[property="og:site_name"]')?.getAttribute('content');
    return { title, description, thumbnail, date, owner };
  });
}

(async () => {
  console.clear();
  let time = 0;
  const interval = setInterval(() => {
    time++;

    if (time < 60) {
      console.log(`${time} seconds`);
      return;
    }
    
    const minutes = Math.floor(time / 60);
    console.log(`${minutes} minute and ${time - (minutes * 60)} seconds`);
  }, 1000);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const blogsUrl = [
    'https://www.alura.com.br/artigos/front-end',
    'https://www.alura.com.br/artigos/programacao',
    'https://www.agenciamestre.com/categoria/seo/',
    'https://www.agenciamestre.com/categoria/redes-sociais/',
    'https://www.agenciamestre.com/categoria/marketing-de-conteudo/',
    'https://www.agenciamestre.com/categoria/geral/',
    'https://www.agenciamestre.com/categoria/ferramentas/',
    'https://css-tricks.com/',
    // 'https://www.joshwcomeau.com/',
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
    // 'https://medium.com/?feed=following',
    // 'https://neilpatel.com/br/blog/',
    // 'https://reinaldoferraz.com.br/',
    // 'https://blog.rocketseat.com.br/',
    // 'https://tableless.com.br/todos-os-posts/',
    // 'https://viverdeblog.com/',
    // 'https://willianjusten.com.br/',
    // 'https://blog.globalcode.com.br/',
    // 'https://wkrh.com.br/blog/',
  ];

  const allPosts = [];

  console.time();
  for (let i = 0; i < blogsUrl.length; i++) {
    console.log(' ');
    console.log(`Starting URL: ${blogsUrl[i]}`);
    console.log(' ');
    // let oneSecond = 1000;
    // let oneMinute = oneSecond * 60;
    // let twoMinutes = oneMinute * 2;
    await page.setDefaultNavigationTimeout(0);
    await page.goto(blogsUrl[i]);
    const postsInfo = await page.$eval('html', getPostsInfo);
    allPosts.push(postsInfo);
    console.log(' ');
    console.log(`Finished URL: ${blogsUrl[i]}`);
    console.log(' ');
    console.log('---');
  }
  console.timeEnd();

  const allPostsSpread = allPosts.reduce((list, sub) => list.concat(sub), []);

  // Remove current posts
  fs.rmSync('./posts', { recursive: true }, error => error && console.log(error));

  // Recreate folder
  fs.mkdirSync('./posts', error => error && console.log(error));
  
  // Create new files
  const postsPerPage = 10;
  const pagesQuantity = Math.ceil(allPostsSpread.length / postsPerPage);

  for (let i = 0; i < pagesQuantity; i++) {
    const firstPostIndex = i * postsPerPage;
    const lastPostIndex = (i + 1) * postsPerPage;
    const currentPosts = allPostsSpread.slice(firstPostIndex, lastPostIndex);
    const fileName = `./posts/page-${i + 1}.json`;
  
    fs.writeFile(
      fileName,
      JSON.stringify(currentPosts, null, 2),
      error => {
        if (error) throw new Error('Something went wrong:', error);
      }
    );
  }

  fs.writeFile(
    './posts/metadata.json',
    JSON.stringify(`{"totalPages": ${pagesQuantity}}`, null, 2),
    error => {
      if (error) throw new Error('Something went wrong:', error);
      clearInterval(interval);
      console.log('Finished!');
    }
  );

  console.log('Total posts:', allPostsSpread.length);
  console.log('Total pages:', pagesQuantity);

  await browser.close();

})();
