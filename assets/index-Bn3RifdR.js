(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e){if(t.type!==`childList`)continue;for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();const e=`modulepreload`,t=function(e){return`/spa/`+e},n={},r=function(r,i,a){let o=Promise.resolve();if(i&&i.length>0){let r=function(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))},s=document.getElementsByTagName(`link`),c=document.querySelector(`meta[property=csp-nonce]`),l=c?.nonce||c?.getAttribute(`nonce`);o=r(i.map(r=>{if(r=t(r,a),r in n)return;n[r]=!0;let i=r.endsWith(`.css`),o=i?`[rel="stylesheet"]`:``,c=!!a;if(c)for(let e=s.length-1;e>=0;e--){let t=s[e];if(t.href===r&&(!i||t.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${r}"]${o}`))return;let u=document.createElement(`link`);if(u.rel=i?`stylesheet`:e,i||(u.as=`script`),u.crossOrigin=``,u.href=r,l&&u.setAttribute(`nonce`,l),document.head.appendChild(u),i)return new Promise((e,t)=>{u.addEventListener(`load`,e),u.addEventListener(`error`,()=>t(Error(`Unable to preload CSS for ${r}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(e=>{for(let t of e||[]){if(t.status!==`rejected`)continue;s(t.reason)}return r().catch(s)})},i=()=>`
    <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold text-gray-900">
                    <a href="/" data-link="">쇼핑몰</a>
                </h1>
                <div class="flex items-center space-x-2">
                    <!-- 장바구니 아이콘 -->
                    <button id="cart-icon-btn" class="relative p-2 text-gray-700 hover:text-gray-900 transition-colors">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 2H3m4 11v6a1 1 0 001 1h1a1 1 0 001-1v-6M13 13v6a1 1 0 001 1h1a1 1 0 001-1v-6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </header>
    `,a=()=>`
    <footer class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-md mx-auto py-8 text-center text-gray-500">
            <p>© ${new Date().getFullYear()} 항해플러스 프론트엔드 쇼핑몰</p>
        </div>
    </footer>
    `,o=`
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
        <div class="aspect-square bg-gray-200"></div>
            <div class="p-3">
                <div class="h-4 bg-gray-200 rounded mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div class="h-8 bg-gray-200 rounded"></div>
            </div>
        </div>
`,s=`
    <div class="text-center py-4">
        <div class="inline-flex items-center">
            <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
        </div>
    </div>
`,c=({productId:e,title:t,image:n,lprice:r})=>`
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
    data-product-id="${e}">
        <!-- 상품 이미지 -->
        <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
            <img src="${n}"
                alt="${t}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy">
        </div>
        <!-- 상품 정보 -->
        <div class="p-3">
            <div class="cursor-pointer product-info mb-3">
                <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                    PVC 투명 젤리 쇼핑백 1호 와인 답례품 구디백 비닐 손잡이 미니 간식 선물포장
                </h3>
                <p class="text-xs text-gray-500 mb-2"></p>
                <p class="text-lg font-bold text-gray-900">
                    ${Number(r).toLocaleString()}원
                </p>
            </div>
            <!-- 장바구니 버튼 -->
            <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="85067212996">
                장바구니 담기
            </button>
        </div>
    </div>
  `,l=({loading:e,products:t})=>`
    <div class="mb-6">
        <div>
            ${e?`
                <!-- 상품 그리드 -->
                <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                    <!-- 로딩 스켈레톤 -->
                    ${o.repeat(4)}
                </div>
                ${s}`:`
                <div class="mb-4 text-sm text-gray-600">
                    총 <span class="font-medium text-gray-900">${t.length}개</span>의 상품
                </div>
                <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
                    ${t.map(c).join(``)}
                `}
        </div>
    </div>
  `,u=()=>`
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <!-- 검색창 -->
        <div class="mb-4">
            <div class="relative">
                <input type="text" id="search-input" placeholder="상품명을 검색해보세요..." value="" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
        <!-- 필터 옵션 -->
        <div class="space-y-3">
            <!-- 카테고리 필터 -->
            <div class="space-y-2">
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">카테고리:</label>
                    <button data-breadcrumb="reset" class="text-xs hover:text-blue-800 hover:underline">전체</button>
                </div>
                <!-- 1depth 카테고리 -->
                <div class="flex flex-wrap gap-2">
                    <div class="text-sm text-gray-500 italic">카테고리 로딩 중...</div>
                </div>
                <!-- 2depth 카테고리 -->
            </div>
            <!-- 기존 필터들 -->
            <div class="flex gap-2 items-center justify-between">
                <!-- 페이지당 상품 수 -->
                <div class="flex items-center gap-2">
                    <label class="text-sm text-gray-600">개수:</label>
                    <select id="limit-select"
                        class="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                        <option value="10">
                            10개
                        </option>
                        <option value="20" selected="">
                            20개
                        </option>
                        <option value="50">
                            50개
                        </option>
                        <option value="100">
                            100개
                        </option>
                    </select>
                </div>
            <!-- 정렬 -->
            <div class="flex items-center gap-2">
                <label class="text-sm text-gray-600">정렬:</label>
                <select id="sort-select" class="text-sm border border-gray-300 rounded px-2 py-1
                    focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                    <option value="price_asc" selected="">가격 낮은순</option>
                    <option value="price_desc">가격 높은순</option>
                    <option value="name_asc">이름순</option>
                    <option value="name_desc">이름 역순</option>
                </select>
            </div>
        </div>
    </div>
</div>
    `,d=({children:e})=>`
    <div class="min-h-screen bg-gray-50">
        ${i()}
        <main class="max-w-md mx-auto px-4 py-4">
            ${e}
        </main>
        ${a()}
    </div>
  `,f=({filters:e,pagination:t,products:n,loading:r})=>d({children:`
    ${u({filters:e,pagination:t})}
    ${l({loading:r,products:n})}
    `});async function p(e={}){let{limit:t=20,search:n=``,category1:r=``,category2:i=``,sort:a=`price_asc`}=e,o=e.current??e.page??1,s=new URLSearchParams({page:o.toString(),limit:t.toString(),...n&&{search:n},...r&&{category1:r},...i&&{category2:i},sort:a}),c=await fetch(`/api/products?${s}`);return await c.json()}async function m(e){let t=await fetch(`/api/products/${e}`);return await t.json()}const h=e=>{let t=Math.floor(e),n=5-t,r=`<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>`;return`
    ${Array(t).fill(null).map(()=>`
      <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        ${r}
      </svg>
    `).join(``)}
    ${Array(n).fill(null).map(()=>`
      <svg class="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        ${r}
      </svg>
    `).join(``)}
  `},g=(e=[])=>!e||e.length===0?``:e.map(e=>`
    <div class="bg-gray-50 rounded-lg p-3 related-product-card cursor-pointer" data-product-id="${e.productId}">
      <div class="aspect-square bg-white rounded-md overflow-hidden mb-2">
        <img src="${e.image}" alt="${e.title}" class="w-full h-full object-cover" loading="lazy">
      </div>
      <h3 class="text-sm font-medium text-gray-900 mb-1 line-clamp-2">${e.title}</h3>
      <p class="text-sm font-bold text-blue-600">${Number(e.lprice).toLocaleString()}원</p>
    </div>
  `).join(``),_=({loading:e,product:t,relatedProducts:n})=>d({children:e?`
    <div class="py-20 bg-gray-50 flex items-center justify-center">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">상품 정보를 불러오는 중...</p>
        </div>
    </div>
    `:`
    <main class="max-w-md mx-auto px-4 py-4">
        <!-- 브레드크럼 -->
        <nav class="mb-4">
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" data-link="" class="hover:text-blue-600 transition-colors">홈</a>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link" data-category1="${t.category1}">
              ${t.category1}
            </button>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <button class="breadcrumb-link" data-category2="${t.category2}">
              ${t.category2}
            </button>
          </div>
        </nav>
        <!-- 상품 상세 정보 -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
          <!-- 상품 이미지 -->
          <div class="p-4">
            <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img src="${t.image}" alt="${t.title}" class="w-full h-full object-cover product-detail-image">
            </div>
            <!-- 상품 정보 -->
            <div>
              <p class="text-sm text-gray-600 mb-1">${t.brand||``}</p>
              <h1 class="text-xl font-bold text-gray-900 mb-3">${t.title}</h1>
              <!-- 평점 및 리뷰 -->
              <div class="flex items-center mb-3">
                <div class="flex items-center">
                  ${h(t.rating||0)}
                </div>
                <span class="ml-2 text-sm text-gray-600">${t.rating||0}.0 (${t.reviewCount||0}개 리뷰)</span>
              </div>
              <!-- 가격 -->
              <div class="mb-4">
                <span class="text-2xl font-bold text-blue-600">${Number(t.lprice).toLocaleString()}원</span>
              </div>
              <!-- 재고 -->
              <div class="text-sm text-gray-600 mb-4">
                재고 ${t.stock}개
              </div>
              <!-- 설명 -->
              <div class="text-sm text-gray-700 leading-relaxed mb-6">
                ${t.description}
              </div>
            </div>
          </div>
          <!-- 수량 선택 및 액션 -->
          <div class="border-t border-gray-200 p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-900">수량</span>
              <div class="flex items-center">
                <button id="quantity-decrease" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-l-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                <input type="number" id="quantity-input" value="1" min="1" max="${t.stock||999}" class="w-16 h-8 text-center text-sm border-t border-b border-gray-300 
                  focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <button id="quantity-increase" class="w-8 h-8 flex items-center justify-center border border-gray-300 
                   rounded-r-md bg-gray-50 hover:bg-gray-100">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
              </div>
            </div>
            <!-- 액션 버튼 -->
            <button id="add-to-cart-btn" data-product-id="${t.productId}" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md 
                 hover:bg-blue-700 transition-colors font-medium">
              장바구니 담기
            </button>
          </div>
        </div>
        <!-- 상품 목록으로 이동 -->
        <div class="mb-6">
          <button class="block w-full text-center bg-gray-100 text-gray-700 py-3 px-4 rounded-md 
            hover:bg-gray-200 transition-colors go-to-product-list">
            상품 목록으로 돌아가기
          </button>
        </div>
        <!-- 관련 상품 -->
        <div class="bg-white rounded-lg shadow-sm">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">관련 상품</h2>
            <p class="text-sm text-gray-600">같은 카테고리의 다른 상품들</p>
          </div>
          <div class="p-4">
            <div class="grid grid-cols-2 gap-3 responsive-grid">
              ${g(n)}
            </div>
          </div>
        </div>
      </main>
    `}),v=()=>r(async()=>{let{worker:e}=await import(`./browser-CcyfQrG1.js`);return{worker:e}},[]).then(({worker:e})=>e.start({serviceWorker:{url:`/spa/mockServiceWorker.js`},onUnhandledRequest:`bypass`})),y=e=>{history.pushState(null,null,e),b()},b=async()=>{let e=document.querySelector(`#root`);if(location.pathname===`/`){e.innerHTML=f({loading:!0});let t=await p();e.innerHTML=f({...t,loading:!1}),document.body.addEventListener(`click`,e=>{if(e.target.closest(`.product-card`)){let t=e.target.closest(`.product-card`).dataset.productId;y(`/products/${t}`)}})}else{e.innerHTML=_({loading:!0});let t=location.pathname.split(`/`).pop(),n=await m(t),r=await p({category2:n.category2}),i=r.products.filter(e=>e.productId!==t).slice(0,2);e.innerHTML=_({loading:!1,product:n,relatedProducts:i})}};window.addEventListener(`popstate`,()=>{b()});const x=()=>{b()};v().then(x);