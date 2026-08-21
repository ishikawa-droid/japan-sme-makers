// 公式サイトURLパッチ
// 確度が高い既知URLのみ収録。それ以外の会社は app.js 側で
// Google検索フォールバックボタンが表示される（誤URLを表示するより安全）。
// URL変更があれば随時更新可能。

const KNOWN_URLS = {
  // === 北海道 ===
  "hk001": "https://www.rokkatei.co.jp/",
  "hk002": "https://www.royce.com/",
  "hk004": "https://www.ishiya.co.jp/",
  "hk006": "https://www.tomoechan.co.jp/",
  "hk008": "https://www.sato-suisan.co.jp/",
  "hk009": "https://www.kitakaro.com/",
  "hk010": "https://www.kinotoya.com/",
  "hk011": "https://www.hokkaidowine.com/",
  "hk012": "https://www.nipponseishu.co.jp/",
  "hk013": "https://www.otokoyama.com/",
  "hk014": "https://www.takasagoshuzo.com/",
  "hk015": "https://www.kunimare.co.jp/",
  "hk018": "https://shiro-shiro.jp/",
  "hk020": "https://www.northfarmstock.com/",
  "hk024": "https://www.condehouse.co.jp/",
  "hk026": "https://www.kitanosumai-sekkeisha.com/",
  "hk029": "https://www.aminoup.co.jp/",

  // === 青森 ===
  "am002": "https://tsugaruvidro.jp/",
  "am005": "https://www.shinyapple.jp/",
  "am006": "https://kaneshou.co.jp/",
  "am008": "https://hachinohe-shuzo.com/",
  "am009": "https://www.densyu.co.jp/",
  "am016": "https://www.aomoriai.com/",

  // === 岩手 ===
  "iw001": "https://oitomi.jp/",
  "iw002": "https://www.iwachu.co.jp/",
  "iw004": "https://oigen.jp/",
  "iw005": "https://suzukimorihisa.com/",
  "iw009": "https://www.nanbubijin.co.jp/",
  "iw010": "https://www.asabiraki-net.jp/",
  "iw011": "https://kikunotsukasa.jp/",
  "iw013": "https://iwaizumi-milk.co.jp/",

  // === 宮城 ===
  "mg004": "https://www.sasaju.co.jp/",
  "mg005": "https://www.abekama.co.jp/",
  "mg007": "https://www.kanezaki.co.jp/",
  "mg008": "https://www.ichinokura.co.jp/",
  "mg009": "https://www.urakasumi.com/",
  "mg010": "https://hirakoushuzou.co.jp/",
  "mg016": "https://www.rikyu-gyutan.co.jp/",

  // === 秋田 ===
  "ak001": "https://magewappa.com/",
  "ak002": "https://magewappa.co.jp/",
  "ak005": "https://www.mugendo.jp/",
  "ak006": "https://www.sato-yoske.co.jp/",
  "ak007": "https://www.aramasa.jp/",
  "ak008": "https://www.takashimizu.co.jp/",
  "ak009": "https://www.ryozeki.co.jp/",
  "ak015": "https://yatsuyanagi.jp/",
  "ak016": "https://denshiro.jp/",

  // === 山形 ===
  "yg001": "https://www.dewazakura.co.jp/",
  "yg005": "https://www.toko-sake.co.jp/",
  "yg007": "https://www.tendo-mokko.co.jp/",
  "yg008": "https://www.satoseni.com/",
  "yg012": "https://kikuchi-hojudo.com/",
  "yg013": "https://oc-jp.com/",

  // === 福島 ===
  "fk001": "https://www.suzuzen.com/",
  "fk003": "https://www.sake-suehiro.jp/",
  "fk004": "https://miyaizumi.co.jp/",
  "fk006": "https://www.daishichi.com/",
  "fk007": "https://www.okunomatsu.co.jp/",

  // === 茨城 ===
  "ib001": "https://www.kodawari.cc/",
  "ib002": "https://www.meirishurui.com/",
  "ib003": "https://www.fuchuhomare.com/",
  "ib004": "https://www.raifuku.co.jp/",
  "ib008": "https://www.tengunatto.com/",
  "ib013": "https://yukitumugi.co.jp/",

  // === 栃木 ===
  "tg001": "https://www.tsukamoto.net/",
  "tg004": "https://www.sohomare.co.jp/",
  "tg005": "https://senkin.co.jp/",
  "tg014": "https://www.tochigi-leather.com/",

  // === 群馬 ===
  "gm002": "https://www.yokoodairyfoods.co.jp/",
  "gm005": "https://www.osawaya.co.jp/",
  "gm006": "https://www.tamaruya.jp/",

  // === 埼玉 ===
  "st002": "https://www.kurazukuri.com/",
  "st003": "https://www.koedo-kameya.com/",
  "st005": "https://saitama-ogawawashi.jp/",
  "st007": "https://kagamiyama.jp/",
  "st008": "https://www.shinkame.co.jp/",
  "st010": "https://www.one-drinks.com/",
  "st011": "https://www.chichibu-nishiki.co.jp/",
  "st016": "https://www.sekiguchien-shop.com/",
  "st017": "https://www.hirumaen.com/",

  // === 千葉 ===
  "cb002": "https://www.nagomi-yoneya.co.jp/",
  "cb003": "https://www.holland-ya.jp/",
  "cb004": "https://www.higeta.co.jp/",
  "cb005": "https://www.yamasa.com/",
  "cb006": "https://www.miyashoyu.co.jp/",
  "cb008": "https://www.iinumahonke.co.jp/",
  "cb009": "https://www.nabedana.co.jp/",
  "cb010": "https://kankiku.com/",
  "cb024": "https://www.kikkoman.co.jp/manjo/",

  // === 東京 ===
  "tk001": "https://www.horiguchiglass.com/",
  "tk002": "https://kiriko.net/",
  "tk003": "https://www.hanashyo.com/",
  "tk004": "https://www.kimotoglass.tokyo/",
  "tk005": "https://hirota-glass.co.jp/",
  "tk006": "https://www.nakagawa-masashichi.jp/",
  "tk009": "https://tsuchiya-kaban.jp/",
  "tk010": "https://www.hamano.co.jp/",
  "tk013": "https://www.tokyomatsuya.co.jp/",
  "tk014": "https://www.ozuwashi.net/",
  "tk015": "https://www.haibara.co.jp/",
  "tk016": "https://www.kyukyodo.co.jp/",
  "tk017": "https://www.ibasen.co.jp/",
  "tk018": "https://www.hakuchikudo.co.jp/",
  "tk021": "https://www.mori-silver.co.jp/",
  "tk024": "https://www.murata-megane.co.jp/",
  "tk025": "https://www.kaneko-optical.co.jp/",
  "tk026": "https://www.kiya-hamono.co.jp/",
  "tk027": "https://ubukeya.com/",
  "tk028": "https://www.kikuhide.jp/",
  "tk029": "https://kama-asa.co.jp/",
  "tk030": "https://www.kappabashi.or.jp/",
  "tk028b": "https://www.tomita-senkougei.com/",
  "tk033": "https://www.onoya.com/",
  "tk034": "https://funawa.jp/",
  "tk035": "https://www.kameju.com/",
  "tk036": "https://www.toraya-group.co.jp/",
  "tk038": "https://sembikiya.co.jp/",
  "tk039": "https://www.eitaro.com/",
  "tk043": "https://www.yamamotoyama.co.jp/",
  "tk054": "https://www.ayura.co.jp/",
  "tk056": "https://osaji.net/",
  "tk057": "https://andbe-official.com/",
  "tk058": "https://www.toonecosmetics.com/",
  "tk069": "https://www.sawanoi-sake.com/",
  "tk070": "https://www.tamajiman.co.jp/",
  "tk072": "https://www.seishu-kasen.com/",
  "tk076": "https://www.edofurin.com/",

  // === 神奈川 ===
  "kn001": "https://www.hakkodo.jp/",
  "kn003": "https://www.hato.co.jp/",
  "kn004": "https://www.beniya-ajisai.co.jp/",
  "kn006": "https://kiyoken.com/",
  "kn008": "https://www.kamaboko.com/",
  "kn009": "https://www.kagosei.co.jp/",
  "kn012": "https://www.yoseki.com/",
  "kn027": "https://setosyuzou.com/",
  "kn028": "https://www.kawanishiya.com/",

  // === 新潟 (燕三条) ===
  "ng001": "https://www.gyokusendo.com/",
  "ng002": "https://www.suwada.co.jp/",
  "ng003": "https://tojiro.net/",
  "ng004": "https://www.tadafusa.com/",
  "ng006": "https://www.snowpeak.co.jp/",
  "ng007": "https://www.marunao.com/",
  "ng010": "https://yamazaki-kk.com/",
  "ng012": "https://wahei.co.jp/",
  "ng014": "https://hinoura-knife.com/",
  "ng016": "https://www.asahi-shuzo.co.jp/",
  "ng017": "https://www.hakkaisan.com/",
  "ng018": "https://www.jozen.co.jp/",
  "ng019": "https://www.imayotsukasa.co.jp/",
  "ng020": "https://imayotsukasa.co.jp/",
  "ng033": "https://www.migaki-ya.com/",
  "ng038": "https://www.kamite.co.jp/",
  "ng041": "https://www.sado-milk.co.jp/",
  "ng044": "https://tsunan-sake.com/",
  "ng045": "https://www.ichishima.jp/",
  "ng047": "https://www.echigoseika.co.jp/",

  // === 富山 ===
  "ty001": "https://www.oigo.jp/",
  "ty002": "https://www.nousaku.co.jp/",
  "ty003": "https://yotsukawa.com/",
  "ty004": "https://mf-orii.co.jp/",
  "ty005": "https://syouryu.shimatani.co.jp/",
  "ty006": "https://www.koukandou.co.jp/",
  "ty007": "https://www.hangontan.co.jp/",
  "ty009": "https://www.tateyama.jp/",
  "ty010": "https://www.masuizumi.co.jp/",
  "ty012": "https://www.mabotaru.co.jp/",
  "ty013": "https://aimono-konbu.com/",
  "ty014": "https://umekama.co.jp/",
  "ty015": "https://www.minamoto.co.jp/",
  "ty016": "https://www.inamichoukoku.jp/",
  "ty018": "https://www.gokayama-washi.jp/",
  "ty020": "https://toyama-garasukobo.jp/",

  // === 石川 ===
  "is001": "https://www.hakuichi.co.jp/",
  "is002": "https://www.kinpaku.co.jp/",
  "is004": "https://www.kaburaki.jp/",
  "is005": "https://kutaniseiyou.co.jp/",
  "is006": "https://choemon.com/",
  "is007": "https://hakuza.co.jp/",
  "is008": "https://www.kirimoto.net/",
  "is010": "https://www.tayashikkiten.co.jp/",
  "is014": "https://www.fukumitsuya.co.jp/",
  "is015": "https://noguchi-naohiko.co.jp/",
  "is016": "https://www.sogen-shuzou.com/",
  "is019": "https://kintuba.co.jp/",
  "is020": "https://www.kagaboucha.co.jp/",
  "is021": "https://hakusan-syuzo.com/",

  // === 福井 ===
  "fi002": "https://www.kaneko-optical.co.jp/",
  "fi003": "https://www.bjclassic.jp/",
  "fi004": "https://www.bostonclub.co.jp/",
  "fi005": "https://hakusan-megane.co.jp/",
  "fi006": "https://www.fournines.co.jp/",
  "fi007": "https://www.shitsurindo.com/",
  "fi009": "https://ryusen-hamono.com/",
  "fi010": "https://www.knife-takamura.com/",
  "fi011": "https://www.iwano-ichibei.jp/",
  "fi012": "https://www.washiya.com/",
  "fi015": "https://www.kokuryu.co.jp/",
  "fi016": "https://www.born.co.jp/",
  "fi018": "https://www.matsukan.com/",
  "fi019": "https://www.hyozaemon.co.jp/",

  // === 山梨 ===
  "ym004": "https://www.katsunuma-winery.com/",
  "ym005": "https://www.grace-wine.com/",
  "ym006": "https://www.lumiere.jp/",
  "ym007": "https://www.rubaiyat.jp/",
  "ym008": "https://www.sake-shichiken.co.jp/",
  "ym009": "https://www.takenoi.jp/",
  "ym010": "https://www.kikyouya.co.jp/",
  "ym011": "https://www.kinseiken.co.jp/",

  // === 長野 ===
  "nn002": "https://marutaka-suwa.com/",
  "nn004": "https://www.obinata.co.jp/",
  "nn006": "https://www.shinshuham.co.jp/",
  "nn007": "https://www.hakubanishiki.com/",
  "nn008": "https://www.masumi.co.jp/",
  "nn009": "https://maihime.co.jp/",
  "nn010": "https://www.obusewinery.com/",
  "nn011": "https://obusedo.com/",
  "nn012": "https://www.chikufudo.com/",
  "nn013": "https://www.matsumin.com/",

  // === 岐阜 ===
  "gf002": "https://sakuzan.co.jp/",
  "gf003": "https://www.barbar.co.jp/",
  "gf007": "https://www.kai-group.com/",
  "gf009": "https://sumikama.co.jp/",
  "gf011": "https://www.iedashikou.com/",
  "gf014": "https://oakv.co.jp/",
  "gf015": "https://www.hidasangyo.com/",
  "gf016": "https://www.kashiwa.gr.jp/",
  "gf017": "https://www.hakusen.co.jp/",
  "gf018": "https://www.kosaka-syuzou.com/",
  "gf019": "https://www.sake-hourai.co.jp/",
  "gf022": "https://www.ozeki-lantern.co.jp/",

  // === 静岡 ===
  "sz007": "https://nanaya-matcha.com/",
  "sz014": "https://www.shunkado.co.jp/",
  "sz015": "https://www.jiichiro.com/",
  "sz016": "https://www.yamadaichi.com/",
  "sz019": "https://katsuobushi.com/",
  "sz020": "https://www.isojiman-sake.jp/",
  "sz022": "https://hananomai.co.jp/",
  "sz023": "https://shidaizumi.com/",

  // === 愛知 ===
  "ai003": "https://www.setohongyo.jp/",
  "ai005": "https://www.takedakahei.co.jp/",
  "ai007": "https://kawai-fude.jp/",
  "ai010": "https://www.kakukyu.jp/",
  "ai011": "https://www.maruyahatcho.com/",
  "ai012": "https://www.nakamo.co.jp/",
  "ai014": "https://www.myokoen.com/",
  "ai016": "https://www.kuheiji.co.jp/",
  "ai017": "https://www.nemuri-tonbo.com/",

  // === 三重 ===
  "me001": "https://www.kadoyabeer.com/",
  "me002": "https://www.akafuku.co.jp/",
  "me003": "https://henbaya.jp/",
  "me005": "https://www.mikimoto-pearl.com/",
  "me007": "https://osugikatagami.jp/",
  "me008": "https://isemomen.co.jp/",
  "me012": "https://www.igamono.co.jp/",
  "me014": "https://www.hanzo-sake.com/",
  "me015": "https://seizaburo.jp/",
  "me016": "https://hayakawasyuzou.jp/",

  // === 滋賀 ===
  "sg001": "https://meizan.com/",
  "sg002": "https://furutani.co/",
  "sg007": "https://tsuruyapan.jp/",
  "sg008": "https://kanou.com/",
  "sg009": "https://clubharie.jp/",
  "sg010": "https://taneya.jp/",
  "sg012": "https://www.fukui-yahei.co.jp/",
  "sg013": "https://kirakucho.jp/",
  "sg014": "https://www.7yari.co.jp/",

  // === 京都 ===
  "ky001": "https://www.hosoo.co.jp/",
  "ky002": "https://www.kawashimaselkon.com/",
  "ky004": "https://www.kondaya.com/",
  "ky005": "https://www.tatsumura.co.jp/",
  "ky006": "https://www.chiso.co.jp/",
  "ky009": "https://www.aiba-kyouchiwa.jp/",
  "ky010": "https://www.baisenan.co.jp/",
  "ky011": "https://www.hakuchikudo.co.jp/",
  "ky012": "https://www.asahido.co.jp/",
  "ky015": "https://www.wagasa.com/",
  "ky016": "https://www.zohiko.co.jp/",
  "ky019": "https://www.yasuda-juzu.co.jp/",
  "ky021": "https://www.kohchosai.co.jp/",
  "ky022": "https://www.turuya.co.jp/",
  "ky023": "https://www.toraya-group.co.jp/",
  "ky024": "https://oimatu.co.jp/",
  "ky025": "https://www.kyoto-suetomi.com/",
  "ky026": "https://7jyo-kansyundo.co.jp/",
  "ky027": "https://www.tokichi.jp/",
  "ky028": "https://www.itohkyuemon.co.jp/",
  "ky029": "https://www.marukyu-koyamaen.co.jp/",
  "ky030": "https://www.morihan.com/",
  "ky031": "https://www.giontsujiri.co.jp/",
  "ky032": "https://www.fukujuen.com/",
  "ky033": "https://www.ippodo-tea.co.jp/",
  "ky034": "https://www.yojiya.co.jp/",
  "ky036": "https://www.hakuhodo.jp/",
  "ky038": "https://nemohamo.com/",
  "ky040": "https://maikohan.com/",
  "ky041": "https://www.gekkeikan.co.jp/",
  "ky042": "https://shotoku.co.jp/",
  "ky043": "https://jukondo.jp/",
  "ky045": "https://eikun.com/",
  "ky046": "https://www.tamanohikari.co.jp/",
  "ky047": "https://www.nishiri.co.jp/",
  "ky048": "https://www.daiyasu.co.jp/",
  "ky050": "https://www.hanbey.co.jp/",
  "ky051": "https://www.fuka-kyoto.com/",
  "ky054": "https://www.chidorisu.co.jp/",
  "ky055": "https://www.yatsuhashi.co.jp/",
  "ky056": "https://www.shogoin.co.jp/",
  "ky059": "https://www.shoyeido.co.jp/",
  "ky060": "https://www.yamadamatsu.co.jp/",

  // === 大阪 ===
  "os002": "https://www.aritsugu.com/",
  "os003": "https://www.sakaitakayuki.co.jp/",
  "os005": "https://www.aoki-hamono.co.jp/",
  "os027": "https://www.ogkkabuto.co.jp/",

  // === 兵庫 ===
  "hy001": "https://www.kikumasamune.co.jp/",
  "hy002": "https://www.hakutsuru.co.jp/",
  "hy003": "https://www.kenbishi.co.jp/",
  "hy004": "https://www.sawanotsuru.co.jp/",
  "hy005": "https://www.konishi.co.jp/",
  "hy006": "https://www.taturiki.com/",
  "hy014": "https://www.kobe-fugetsudo.co.jp/",
  "hy015": "https://www.morozoff.co.jp/",
  "hy017": "https://www.ibonoito.or.jp/",
  "hy021": "https://cocomeister.jp/",
  "hy023": "https://toyooka-kaban.jp/",

  // === 奈良 ===
  "na001": "https://www.akashiya-fude.co.jp/",
  "na002": "https://kobaien.jp/",
  "na004": "https://take-yamada.com/",
  "na009": "https://www.yu-nakagawa.co.jp/",
  "na012": "https://www.miwayama.co.jp/",
  "na013": "https://www.ikeri.co.jp/",
  "na015": "https://www.naraduke.co.jp/",
  "na016": "https://www.harushika.com/",
  "na017": "https://www.umenoyado.com/",
  "na018": "https://www.yucho-sake.jp/",
  "na020": "https://www.kudzu.co.jp/",

  // === 和歌山 ===
  "wk002": "https://www.nakatafoods.co.jp/",
  "wk003": "https://www.kishu-umeboshi.jp/",
  "wk009": "https://www.nakano-group.co.jp/",
  "wk010": "https://www.kunokuni.co.jp/",
  "wk011": "https://www.sekaiitto.co.jp/",
  "wk012": "https://www.kadocho.co.jp/",
  "wk013": "https://www.marushinhonke.com/",
  "wk015": "https://kannonyama.com/",

  // === 鳥取・島根 ===
  "tt005": "https://chiyomusubi.co.jp/",
  "sh002": "https://www.haneyasoba.co.jp/",
  "sh004": "https://www.rihaku.co.jp/",
  "sh008": "https://nakaura.co.jp/",
  "sh009": "https://www.gungendo.co.jp/",

  // === 岡山 ===
  "ok005": "https://betty.co.jp/",
  "ok006": "https://www.momotarojeans.com/",
  "ok007": "https://www.japanblue-jeans.com/",
  "ok008": "https://www.bigjohn.co.jp/",
  "ok009": "https://www.evisu.com/",
  "ok011": "https://www.koeido.co.jp/",
  "ok014": "https://www.msb.co.jp/",
  "ok015": "https://www.sake-okayama.com/",
  "ok016": "https://www.chikurin.jp/",
  "ok018": "https://www.kurashiki-hanpu.co.jp/",
  "ok019": "https://www.classiky.co.jp/",

  // === 広島 ===
  "hi001": "https://www.hakuhodo.jp/",
  "hi002": "https://www.chikuhodo.com/",
  "hi003": "https://www.koyudo.co.jp/",
  "hi006": "https://miyajima-shamoji.jp/",
  "hi007": "https://nisikido.co.jp/",
  "hi008": "https://yamadaya.co.jp/",
  "hi009": "https://www.momiji.co.jp/",
  "hi010": "https://www.otafuku.co.jp/",
  "hi013": "https://hakubotan.co.jp/",
  "hi014": "https://www.kamoizumi.co.jp/",
  "hi015": "https://www.kireinishu.jp/",
  "hi017": "https://www.taketsuru.co.jp/",

  // === 山口 ===
  "yc001": "https://oyogama.com/",
  "yc002": "https://www.sakakurashinbei.com/",
  "yc003": "https://miwagama.com/",
  "yc005": "https://www.asahishuzo.ne.jp/",
  "yc006": "https://yaoshin.co.jp/",
  "yc007": "https://gokyo-sake.co.jp/",

  // === 徳島・香川・愛媛・高知 ===
  "ts001": "https://furushou.jp/",
  "ts002": "https://www.buaisou-i.com/",
  "ts003": "https://www.awagami.jp/",
  "ts008": "https://www.narutotai.jp/",
  "ts010": "https://wasanbon.co.jp/",
  "kg003": "https://ishimaru-seimen.co.jp/",
  "kg005": "https://www.marugameuchiwa.jp/",
  "kg007": "https://yama-roku.net/",
  "kg008": "https://www.marukin-shoyu.com/",
  "kg009": "https://shodoshima.or.jp/",
  "kg010": "https://kotobukinishino.com/",
  "kg011": "https://kawatsuru.com/",
  "kg012": "https://kinashibonsai.com/",
  "kg014": "https://www.ikkaku.co.jp/",
  "eh001": "https://www.kontex.co.jp/",
  "eh002": "https://www.ikeuchi.org/",
  "eh003": "https://kusu-mon.com/",
  "eh005": "https://www.itoweb.com/",
  "eh006": "https://www.tobeyaki.co.jp/",
  "eh009": "https://kirinomori.co.jp/",
  "eh010": "https://www.umenishiki.com/",
  "eh011": "https://www.ishizuchi.co.jp/",
  "eh012": "https://www.dogobeer.co.jp/",
  "kc003": "https://www.toyokuni.net/",
  "kc005": "https://www.tsukasabotan.co.jp/",
  "kc006": "https://www.mutemuka.com/",
  "kc007": "https://umajimura.jp/",

  // === 福岡 ===
  "fo001": "https://www.nishimuraori.com/",
  "fo003": "https://nakamura-ningyo.com/",
  "fo005": "https://www.meigetsudo.co.jp/",
  "fo006": "https://www.hiyoko.co.jp/",
  "fo007": "https://josuian.jp/",
  "fo008": "https://www.kubara.jp/",
  "fo009": "https://www.kayanoya.com/",
  "fo010": "https://www.fukusaya.co.jp/",
  "fo011": "https://www.fukuya.com/",
  "fo012": "https://www.yamaya.com/",
  "fo014": "https://hayakawa-toubou.com/",
  "fo016": "https://www.ikeda-kasuri.jp/",
  "fo017": "https://shimokawaorimono.com/",
  "fo019": "https://www.kitaya.co.jp/",
  "fo020": "https://www.shiraito.com/",
  "fo021": "https://www.morinokura.co.jp/",

  // === 佐賀・長崎 ===
  "sa001": "https://www.koransha.co.jp/",
  "sa002": "https://www.fukagawa-seiji.co.jp/",
  "sa003": "https://www.gen-emon.co.jp/",
  "sa004": "https://www.kakiemon.co.jp/",
  "sa005": "https://imaemon.co.jp/",
  "sa007": "https://hataman.jp/",
  "sa008": "https://www.taroemon.com/",
  "sa009": "https://www.ryuta-gama.com/",
  "sa012": "https://www.muraokaya.co.jp/",
  "sa013": "https://www.kitajimaya.co.jp/",
  "sa015": "https://nabeshima.co.jp/",
  "sa016": "https://www.tenzan.co.jp/",
  "sa017": "https://www.mitsutake.co.jp/",
  "nk001": "https://www.castella.co.jp/",
  "nk002": "https://www.bunmeido.ne.jp/",
  "nk003": "https://shooken.com/",
  "nk004": "https://www.hasamiyaki.jp/",
  "nk006": "https://www.hakusan-porcelain.co.jp/",
  "nk011": "https://www.tsubaki-abura.jp/",
  "nk014": "https://www.fukudashuzou.co.jp/",
  "nk015": "https://ikinohana.co.jp/",
  "nk016": "https://genkai-sake.com/",

  // === 熊本・大分・宮崎・鹿児島 ===
  "km001": "https://www.kosuke-zougan.com/",
  "km004": "https://fuji-bambi.com/",
  "km005": "https://www.kobai.jp/",
  "km007": "https://hakutake.co.jp/",
  "km008": "https://sengetsu.co.jp/",
  "km009": "https://torikai.jp/",
  "km010": "https://www.zuiyo.co.jp/",
  "oi001": "https://www.takeko.jp/",
  "oi007": "https://www.nikaido-shuzo.co.jp/",
  "oi008": "https://www.iichiko.co.jp/",
  "oi009": "https://www.oimatsu.com/",
  "oi010": "https://onta-yaki-sakamoto.com/",
  "mz004": "https://www.kirishima.co.jp/",
  "mz005": "https://www.unkai.co.jp/",
  "mz013": "https://miyazaki-caviar.com/",
  "kr001": "https://www.satsumakiriko.jp/",
  "kr003": "https://chin-jukan.co.jp/",
  "kr005": "https://www.hozan.jp/",
  "kr007": "https://www.satsuma.co.jp/",
  "kr008": "https://murao-shuzo.jp/",
  "kr009": "https://www.komasa.co.jp/",
  "kr011": "https://yamayoshi-honten.com/",
  "kr016": "https://www.kokuto.co.jp/",
  "kr019": "https://chiran-cha.com/",

  // === 沖縄 ===
  "ow001": "https://shiroma-bingata.com/",
  "ow003": "https://okuhara-glass.com/",
  "ow004": "https://inamine-glass.com/",
  "ow006": "https://www.ikutouen.com/",
  "ow009": "https://www.kumejimatsumugi.com/",
  "ow010": "https://kijoka.jp/",
  "ow012": "https://www.zuisen.co.jp/",
  "ow013": "https://www.k-kumesen.co.jp/",
  "ow014": "https://chuko-awamori.com/",
  "ow015": "https://www.seifuku.co.jp/",
  "ow017": "https://www.chinsuko.co.jp/",
  "ow018": "https://www.nuchima-su.co.jp/",

  // === 化粧品（data_cosmetics.js 由来）===
  "cos_tk01": "https://www.kohgendo.com/",
  "cos_tk02": "https://www.threecosmetics.com/",
  "cos_tk03": "https://www.acseine.co.jp/",
  "cos_tk04": "https://www.ampleur.jp/",
  "cos_tk05": "https://www.hacci1912.com/",
  "cos_tk06": "https://whomee.jp/",
  "cos_tk07": "https://naturaglace.jp/",
  "cos_tk08": "https://uka.co.jp/",
  "cos_tk09": "https://n-organic.com/",
  "cos_tk11": "https://celvoke.com/",
  "cos_tk12": "https://www.mediplus.co.jp/",
  "cos_tk13": "https://www.tunemakers.net/",
  "cos_tk16": "https://www.nihon-zettoc.co.jp/",
  "cos_tk17": "https://www.do-organic.com/",
  "cos_tk18": "https://www.proudmen.jp/",
  "cos_tk19": "https://www.addiction-beauty.com/",
  "cos_tk20": "https://www.isehanhonten.co.jp/",
  "cos_tk21": "https://www.ayura.co.jp/",
  "cos_os01": "https://etvos.com/",
  "cos_os03": "https://www.takeuchi-pharm.co.jp/",
  "cos_os04": "https://www.toyo-beauty.co.jp/",
  "cos_os07": "https://www.asuka-corp.co.jp/",
  "cos_kn01": "https://www.adjuvant.co.jp/",
  "cos_ym01": "https://www.arsoa.co.jp/",

  // === 2026-08-22 追加：URL未収録だった600社の実在調査で判明した公式サイト（197社） ===
  // 調査結果の正本 = 実在調査-600社-20260822.tsv
  // ⚠ 県・社名・業種に不一致があった33社は意図的に除外（TSVの根拠欄に🔴で明記）
  "hk003": "https://www.yotsuba.co.jp/",  // よつ葉乳業（北海道）
  "hk016": "https://kamikawa-taisetsu.co.jp/",  // 上川大雪酒造（北海道）
  "hk023": "https://asahikawa-kagu.or.jp/",  // 旭川家具クラフト（北海道）
  "am007": "https://www.hachikan.co.jp/",  // 八戸缶詰（青森）
  "am010": "https://www.hatomasa.jp/",  // 鳩正宗（青森）
  "am011": "https://rokkashuzo.com/",  // 六花酒造（青森）
  "am014": "https://sakiori.jp/",  // 南部裂織保存会（青森）
  "iw006": "https://www.ginga.or.jp/nanbu/",  // 岩手南部鉄器協同組合（岩手）
  "iw007": "https://wankosoba.jp/",  // わんこそば老舗 東家（岩手）
  "iw012": "http://www.washinoo.co.jp/",  // わしの尾（岩手）
  "iw015": "https://nanbuhouki.jp/",  // 南部箒工房 高倉（岩手）
  "iw020": "https://www.homespun.co.jp/",  // 花巻織物（岩手）
  "mg006": "https://www.shiraken.co.jp/",  // 白謙蒲鉾店（宮城）
  "mg012": "https://www.hagino-shuzou.co.jp/",  // 萩野酒造（宮城）
  "ak003": "https://www.kurikyu.jp/",  // 栗久 (曲げわっぱ)（秋田）
  "ak010": "https://www.yukinobosha.jp/",  // 齋彌酒造（秋田）
  "ak011": "https://www.yamamoto-brewery.com/",  // 山本合名（秋田）
  "ak012": "https://hinomaru-sake.com/",  // 日の丸醸造（秋田）
  "yg003": "https://www.tatenokawa.com/",  // 楯の川酒造（山形）
  "yg004": "https://www.mitobesake.com/",  // 水戸部酒造（山形）
  "yg006": "https://o-ki.co.jp/",  // 米沢牛黄木（山形）
  "yg015": "https://www.ginzanonsen.jp/yado/fujiya.html",  // おしんの宿 銀山温泉藤屋（山形）
  "yg016": "https://www.takahata-winery.jp/",  // 高畠ワイナリー（山形）
  "fk002": "https://www.shirokiyashikkiten.com/",  // 白木屋漆器店（福島）
  "fk008": "http://www.ramenkai.com/",  // 喜多方ラーメン老麺会（福島）
  "fk011": "http://www.ryuumon.co.jp/",  // 会津本郷焼 流紋焼（福島）
  "fk018": "http://www.aizukiri.co.jp/",  // 会津桐タンス（福島）
  "ib005": "https://kasamayaki.co.jp/",  // 笠間焼 向山窯（茨城）
  "ib006": "https://www.kasamayaki.or.jp/",  // 笠間芸術の森協同組合（茨城）
  "ib007": "http://www.darumanatto.jp/",  // 納豆 だるま食品（茨城）
  "ib019": "http://www.kaminosato.com/",  // 常陸大宮和紙（茨城）
  "tg007": "https://www.watanabesahei.co.jp/",  // 渡邊佐平商店（栃木）
  "tg008": "https://www.gyozakai.com/",  // 宇都宮餃子協会連携（栃木）
  "tg009": "https://nikko-pudding.jp/",  // 日光プリン亭（栃木）
  "tg010": "https://www.tamarizuke.co.jp/",  // 今市味噌（栃木）
  "tg012": "https://www.koisagoyaki.co.jp/",  // 小砂焼 藤田製陶所（栃木）
  "gm003": "https://www.shimonita-natto.jp/",  // 下仁田納豆（群馬）
  "gm004": "https://www.jazmf.co.jp/",  // 高崎ハム（群馬）
  "gm007": "http://www.bunbuku.net/",  // 分福酒造（群馬）
  "gm008": "http://www.ryujin.jp/",  // 龍神酒造（群馬）
  "gm009": "https://akagisan.com/",  // 近藤酒造（群馬）
  "gm010": "http://www.kiryuorimono.or.jp/",  // 桐生織物協同組合（群馬）
  "gm012": "http://www.usuiseishi.co.jp/",  // 碓氷製糸（群馬）
  "gm013": "https://www.tomioka-silkbrand.jp/",  // 富岡シルク（群馬）
  "gm019": "https://www.yunokahonpo.com/",  // 草津温泉湯の花（群馬）
  "st001": "https://monzouan.com/",  // 川越米菓 紋蔵庵（埼玉）
  "st006": "https://www.seiun-sake.co.jp/",  // 晴雲酒造（埼玉）
  "st009": "https://www.bukou.co.jp/",  // 武甲酒造（埼玉）
  "st014": "https://sokasenbei.com/",  // 草加せんべい振興協議会（埼玉）
  "st018": "https://www.kawaguchi-imono.jp/",  // 川口鋳物協同組合（埼玉）
  "cb007": "https://www.chibashoyu.com/",  // ちば醤油（千葉）
  "cb014": "https://allchoshi.com/",  // 銚子水産加工（千葉）
  "cb015": "https://boso-olive.co.jp/",  // 南房総オリーブ（千葉）
  "cb022": "http://sammu-sea-salt.com/",  // 九十九里塩（千葉）
  "tk007": "https://www.sumidakawasuki.com/",  // 墨田革漉き工房（東京）
  "tk011": "https://www.kanameya.co.jp/",  // 銀座かなめ屋（東京）
  "tk020": "https://www.soutatsukamikawa.com/",  // 東京銀器 上川宗達（東京）
  "tk022": "https://isogai-bekko.jp/",  // 江戸べっ甲 磯貝（東京）
  "tk032": "https://www.ochiai-san.com/",  // 江戸更紗 二葉苑（東京）
  "tk037": "https://www.senbei.co.jp/",  // 喜八堂（東京）
  "tk040": "https://kototoidango.co.jp/",  // 言問団子（東京）
  "tk066": "https://www.kibun.co.jp/",  // 築地紀文（東京）
  "tk067": "https://edomatoi.jp/",  // 江戸べんとう仕出し（東京）
  "tk071": "http://www.kisho-sake.jp/",  // 野崎酒造（東京）
  "tk073": "https://www.tsubaki-abura.com/",  // 伊豆大島椿油 高田（東京）
  "tk074": "http://www.edokimekomi.com/",  // 江戸木目込人形（東京）
  "tk080": "https://www.ueda-silver.co.jp/",  // 江戸銀器 上田銀器（東京）
  "kn002": "https://www.kamakurabori-kougeikan.jp/",  // 鎌倉彫 伝統工芸協同組合（神奈川）
  "kn005": "https://edosei.co.jp/",  // 横浜中華街 江戸清（神奈川）
  "kn013": "https://www.yoseki-museum.com/",  // 箱根寄木細工 本間木工所（神奈川）
  "kn014": "https://ishikawa-shikki.com/",  // 小田原漆器 石川漆器（神奈川）
  "ng008": "https://www.tadafusa.com/",  // 庖丁工房タダフサ（新潟）
  "ng009": "https://salus.co.jp/",  // 佐藤金属興業 (SALUS)（新潟）
  "ng021": "http://www.takachiyo.co.jp/",  // 高千代酒造（新潟）
  "ng024": "https://www.ajicul.com/",  // 亀田製菓系列ベーカリー（新潟）
  "ng031": "https://kamedajima.com/",  // 亀田縞織物（新潟）
  "ng032": "http://niigatasikki.jp/",  // 新潟漆器（新潟）
  "ng042": "https://niigatabeer.jp/",  // 新潟麦酒 (NIIGATA BEER)（新潟）
  "ng043": "https://www.suwada.co.jp/",  // スワダ刃物（新潟）
  "ty011": "https://www.kachikoma.com/",  // 勝駒酒造（富山）
  "is009": "http://kirimoto.net/",  // 輪島塗 桐本（石川）
  "is011": "http://www.maida-yuzen.com/",  // 加賀友禅 毎田染画工芸（石川）
  "is017": "https://www.fukumitsuya.co.jp/",  // 加賀鳶 (福光屋)（石川）
  "is024": "https://www.sionosato.com/",  // 能登塩工房（石川）
  "is025": "https://kinzangama.com/",  // 九谷焼 錦山窯（石川）
  "fi001": "https://tanakagannkyou.com/",  // 鯖江メガネ工房 田中眼鏡（福井）
  "fi008": "https://sekisaka.co.jp/home.php",  // 越前漆器 関坂漆器（福井）
  "fi014": "https://www.hanagaki.co.jp/",  // 南部酒造場（福井）
  "ym001": "https://yja.or.jp/",  // 甲府ジュエリー協同組合（山梨）
  "ym012": "https://www.kosaku.co.jp/",  // 小作 (ほうとう)（山梨）
  "ym013": "https://fujiyoshida.yamanashi-tex.jp/",  // 郡内織物協同組合（山梨）
  "ym014": "https://www.tenjin-factory.com/",  // テンジン (富士吉田織物)（山梨）
  "nn014": "https://iiyama-butsudan.net/",  // 飯山仏壇（長野）
  "nn015": "http://www.uchiyama-gami.jp/",  // 内山紙協同組合（長野）
  "gf004": "https://www.maruasa.jp/",  // 丸朝製陶所（岐阜）
  "gf005": "http://yamashi2951.com/",  // 美濃焼 山志製陶所（岐阜）
  "gf010": "https://www.furukawashiko.com/",  // 美濃和紙 古川紙工（岐阜）
  "gf013": "https://www.shibukusa.com/",  // 渋草柳造窯（岐阜）
  "sz002": "https://oyaizu.co.jp/",  // 小柳津清一商店（静岡）
  "sz005": "http://www.marukabu.co.jp/",  // 佐藤製茶 (御茶屋)（静岡）
  "sz008": "https://nakanetea.jp/",  // 中根製茶（静岡）
  "sz009": "https://www.ichikawaen.co.jp/",  // 市川園（静岡）
  "sz010": "https://hagiricha.com/",  // 葉桐 (茶問屋)（静岡）
  "sz024": "https://www.takesensuji.jp/",  // 駿河竹千筋細工（静岡）
  "ai009": "https://www.pasconet.co.jp/",  // 敷島製パン (愛知)（愛知）
  "ai018": "http://www.kintora.jp/",  // 金虎酒造（愛知）
  "ai031": "https://singama.jp/",  // 瀬戸染付焼 加藤（愛知）
  "me006": "https://www.tasaki.co.jp/",  // 伊勢志摩真珠 田崎工房（三重）
  "me010": "https://yamaguchi-p.jp/",  // 萬古急須 山口陶器（三重）
  "me011": "http://www.suzukazumi.co.jp/",  // 鈴鹿墨 進誠堂（三重）
  "me020": "https://www.shinsabo.com/",  // 伊勢茶 かぶせ茶 深緑茶房（三重）
  "sg003": "http://www.oogoya.co.jp/",  // 信楽焼 大小屋（滋賀）
  "sg006": "https://www.sennaritei.co.jp/",  // 近江牛 千成亭（滋賀）
  "ky003": "https://watabun.co.jp/",  // 西陣 渡文（京都）
  "ky014": "https://www.kiyomizuyaki.or.jp/",  // 清水焼 京焼 陶磁器試作（京都）
  "ky018": "http://www.adachikumihimokan.com/",  // 京組紐 安達（京都）
  "ky020": "https://kawase-chozan.com/",  // 京人形 川瀬猪山（京都）
  "ky044": "https://matsuishuzo.com/",  // 松井酒造（京都）
  "ky049": "https://www.kyoto-uchida.ne.jp/",  // 打田漬物（京都）
  "ky052": "http://www.to-fu.co.jp/",  // 湯豆腐 順正（京都）
  "ky053": "https://www.sagatofu-morika.co.jp/",  // 老舗豆腐 嵯峨豆腐 森嘉（京都）
  "ky057": "http://kyoto-iwai.co.jp/",  // 井和井 (京和雑貨)（京都）
  "os004": "https://www.yamawaki-hamono.co.jp/",  // 堺打刃物 山脇刃物製作所（大阪）
  "os006": "https://www.sakaihamono.or.jp/",  // 堺刃物協同組合（大阪）
  "os007": "https://www.sennariya-coffee.jp/",  // 千成屋珈琲 (大阪の老舗)（大阪）
  "os008": "https://fugetsu.jp/",  // 鶴橋風月（大阪）
  "os009": "http://www.kiyasu.jp/",  // 赤福以外 喜八洲総本舗（大阪）
  "os012": "https://kimchi.jp/",  // 高麗食品（大阪）
  "os016": "https://kinoshitaranmaten.hp.peraichi.com/",  // 大阪欄間 木下欄間（大阪）
  "os018": "http://www.osakasuzuki.co.jp/",  // 大阪錫器 すずや（大阪）
  "os029": "https://www.chidoriya.co.jp/",  // 千鳥饅頭総本舗（大阪）
  "os034": "https://www.amanosake.com/",  // 西條合資会社 (天野酒)（大阪）
  "os038": "https://osaka-ranma.com/",  // 大阪欄間組合（大阪）
  "hy009": "https://ohkumagama.com/",  // 丹波立杭焼 大熊窯（兵庫）
  "hy012": "https://funamachi.jp/",  // 明石焼 ふなまち（兵庫）
  "hy019": "https://www.odagaki.co.jp/",  // 丹波黒 黒大豆加工（兵庫）
  "hy029": "https://www.banshuori.com/",  // 播州織 産元織元（兵庫）
  "hy030": "https://kabura-tambanuno.com/",  // 丹波布 工房（兵庫）
  "na003": "https://kinkoen.jp/",  // 奈良墨 錦光園（奈良）
  "na005": "https://chasen.jp/",  // 高山茶筌 久保左文（奈良）
  "na007": "https://akahadayaki.thebase.in/",  // 赤膚焼 大塩（奈良）
  "na008": "https://www.hina-ningyou.com/",  // 奈良一刀彫（奈良）
  "na010": "https://www.maruyama-seni.co.jp/",  // 奈良蚊帳 (麻織物)（奈良）
  "na014": "https://miwa-takada.co.jp/",  // 三輪素麺マル勝（奈良）
  "na019": "https://www.tukicha.com/",  // 奈良大和茶 月ヶ瀬（奈良）
  "wk001": "https://www.ume-honpo.co.jp/",  // 南高梅 紀州梅干本舗（和歌山）
  "wk005": "https://www.bincho.jp/",  // 紀州備長炭（和歌山）
  "wk007": "https://yamaga-shikki.ocnk.net/",  // 紀州漆器 山家漆器店（和歌山）
  "wk008": "https://www.koyasandaisido.jp/",  // 高野山金剛峯寺 御用達 香（和歌山）
  "wk014": "https://kishushokuhin.co.jp/",  // 紀州蜜柑加工（和歌山）
  "tt001": "http://torishoku.com/",  // 鳥取砂丘らっきょう（鳥取）
  "tt006": "https://suwaizumi.jp/",  // 諏訪酒造 (鳥取)（鳥取）
  "tt007": "https://www.daisenham.co.jp/",  // 鳥取大山ハム（鳥取）
  "tt011": "https://nakaigama.jp/",  // 中井窯（鳥取）
  "sh001": "https://sobahonda.com/",  // 出雲そば 本田商店（島根）
  "sh003": "https://kokki.jp/",  // 国暉酒造（島根）
  "sh005": "https://kan-nihonkai.com/",  // 日本海酒造 (環日本海)（島根）
  "sh006": "https://okuizumosyuzou.com/",  // 奥出雲酒造（島根）
  "sh007": "https://www.sakaneya.jp/",  // 出雲ぜんざい 坂根屋（島根）
  "sh012": "https://izumomingeishi.com/",  // 出雲和紙工房（島根）
  "ok004": "https://touyuukai.jp/",  // 備前焼陶友会（岡山）
  "ok012": "https://tsurunotamago.jp/",  // つるの玉子（岡山）
  "hi004": "https://www.kihitsu.jp/",  // 熊野筆 喜筆（広島）
  "hi005": "https://www.kumanofude.or.jp/",  // 熊野筆協同組合（広島）
  "hi016": "https://www.fukubijin.co.jp/",  // 福美人酒造（広島）
  "yc012": "https://www.kawarasoba.jp/",  // 瓦そば たかせ（山口）
  "ts005": "https://narutotai.jp/",  // 徳島すだち加工 松浦酒造（徳島）
  "ts007": "https://www.nissin-shurui.co.jp/",  // 日新酒類（徳島）
  "ts009": "https://housui.com/",  // 芳水酒造 (徳島)（徳島）
  "ts012": "https://www.toku-den.com/",  // 徳島電子部品（徳島）
  "kg001": "https://yamada-ya.com/",  // 讃岐うどん 山田家（香川）
  "kg002": "http://www.kawafuku.co.jp/",  // 讃岐うどん 川福（香川）
  "eh013": "https://keisho-farm.sakura.ne.jp/",  // 大三島 みかん加工（愛媛）
  "eh014": "https://www.ikazaki.jp/",  // 五十崎和紙（愛媛）
  "eh015": "https://tenjinsanshi.wixsite.com/uchiko",  // 内子手すき和紙（愛媛）
  "kc001": "https://kamikoya-washi.com/",  // 土佐和紙 ロギール アウテンボーガルト（高知）
  "kc008": "https://www.asahi-fresh.jp/",  // 高知ゆず ぽん酢 旭フレッシュ（高知）
  "fo004": "https://magemono.com/",  // 博多曲物 柴田玉樹（福岡）
  "fo018": "https://www.shibatatokushouten.com/",  // 博多曲物 柴田徳商店（福岡）
  "fo024": "http://www.tanakachaho.com",  // 八女茶 田中茶舗（福岡）
  "fo025": "https://fukuoka-ochakumiai.jimdofree.com/",  // 八女ふくおか茶協同組合（福岡）
  "sa018": "https://soejimaen.thebase.in/",  // 嬉野茶 副島園（佐賀）
  "sa020": "https://www.jf-sariake.or.jp/",  // 佐賀海苔 佐賀有明海漁協（佐賀）
  "sa021": "https://imari-toujiki.or.jp/",  // 伊万里・有田焼伝統陶磁器組合（佐賀）
  "nk005": "https://cf-nishiyama.jp/",  // 波佐見焼 西山窯（長崎）
  "nk007": "https://www.kohsyo.co.jp/",  // 三川内焼 平戸洸祥団右ヱ門（長崎）
  "nk010": "https://meijiyaham.jp/",  // 長崎ハム（長崎）
  "nk012": "https://www.goto-udon.jp/",  // 五島手延うどん（長崎）
  "oi004": "https://www.kotokotoya.com/",  // 由布院ジャム工房（大分）
  "mz002": "http://kamioki.starfree.jp/",  // 日向夏加工 (上沖産業)（宮崎）
  "mz006": "https://www.sakuranosato.co.jp/",  // 櫻の郷酒造（宮崎）
  "kr010": "https://www.imoshochu.com/",  // 焼酎の祁答院蒸溜所（鹿児島）
  "kr015": "https://oshimatsumugi.com/",  // 大島紬 工房（鹿児島）
  "ow002": "https://www.chinenbingata.com/",  // 琉球紅型 知念紅型（沖縄）
  "ow005": "https://okinawa-umikaze.com/",  // 琉球ガラス 海風ガラス（沖縄）
  "ow011": "https://miyako-joufu.com/",  // 宮古上布 宮古織物（沖縄）
  "ow016": "https://www.okinawa-kurozatou.or.jp/",  // 沖縄 黒糖加工（沖縄）
};

// 起動時にCOMPANIESへURLをマージ
if (typeof COMPANIES !== "undefined") {
  COMPANIES.forEach((c) => {
    if (!c.url && KNOWN_URLS[c.i]) {
      c.url = KNOWN_URLS[c.i];
    }
  });
}

window.KNOWN_URLS = KNOWN_URLS;
