"use client";

import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Code2,
  HelpCircle,
  ListChecks,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cramRules, examBank, getExamQuestions, lessons, PracticeQuestion } from "@/data/course";

type ProgressState = {
  completedLessons: string[];
  answered: Record<string, boolean>;
  wrong: string[];
  lastExamScore: number | null;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type LessonStep = "learn" | "example" | "practice" | "summary";
type ActiveMode = "lesson" | "exam" | "cram";
type LessonScript = { paragraphs: string[]; exampleTitle: string; exampleSteps: string[] };

const initialProgress: ProgressState = {
  completedLessons: [],
  answered: {},
  wrong: [],
  lastExamScore: null,
};

const stepLabels: Record<LessonStep, string> = {
  learn: "1. Anlatım",
  example: "2. Örnek çözüm",
  practice: "3. Kendin dene",
  summary: "4. Sınav özeti",
};

const lessonScripts: Record<string, LessonScript> = {
  csharp: {
    paragraphs: [
      "Merhaba Umut. Bu derse gerçekten sıfırdan başlıyoruz. C# kodunu ilk gördüğünde karışık bir yabancı dil gibi gelmesi normal. Biz bugün kod yazma ustası olmaya çalışmayacağız; sınavda karşına gelen küçük C# parçalarını okuyup ne yaptığını anlamayı öğreneceğiz.",
      "Önce değişkeni düşünelim. Değişken, üstünde isim yazan küçük bir kutu gibidir. `int sayi = 5;` dediğinde bilgisayara şunu söylersin: Bana `sayi` adında bir kutu aç ve içine 5 koy. Sonra kodun başka yerinde `sayi` yazarsan, bilgisayar o kutunun içindeki değere bakar.",
      "Dizi ise yan yana dizilmiş kutular rafıdır. `int[] dizi = {2, 3, 4};` dediğinde tek bir kutu değil, aynı isim altında üç kutuluk bir raf oluşur. Buradaki en önemli nokta şudur: C# dizilerde saymaya 1'den değil 0'dan başlar. Yani ilk kutu `dizi[0]`, ikinci kutu `dizi[1]`, üçüncü kutu `dizi[2]` olur.",
      "İndis dediğimiz şey kutunun sıra numarasıdır. Bunu otobüs koltuğu gibi düşünme; çünkü otobüste genelde 1 numaradan başlarız. C# dizisini daha çok apartman katı gibi düşün: giriş katı 0. İlk eleman giriş katında, yani 0. Bu yüzden `dizi[1]` sana birinci elemanı değil, ikinci elemanı verir.",
      "`for` döngüsü de bilgisayara aynı işi tekrar tekrar yaptırma yoludur. `for (int i = 0; i < dizi.Length; i++)` cümlesi şunu anlatır: i adında bir sayaç aç, 0'dan başlat, dizi bitene kadar devam et, her turda i'yi 1 artır. Böylece dizi elemanlarını tek tek gezebilirsin.",
    ],
    exampleTitle: "Dizide indis nasıl okunur?",
    exampleSteps: [
      "`int[] nums = {2, 3, 4};` kodunu görünce önce rafı çiz: üç kutu var.",
      "Kutuların üstüne değerleri yaz: 2, 3, 4.",
      "Altına indisleri yaz: 0, 1, 2. Burası kritik; değer 2'nin indisi 0'dır.",
      "`nums[1]` soruluyorsa, indisi 1 olan kutuya git. Orada 3 var.",
      "Sonuç: `nums[1]` değeri 3'tür. Sınavda bu tip soruda asla 1'den saymaya başlama.",
    ],
  },
  "big-o": {
    paragraphs: [
      "Merhaba Umut. Big O ilk duyunca matematik gibi korkutuyor ama aslında çok basit bir soru sorar: Veri büyürse iş ne kadar büyür? Yani bilgisayar 10 elemanda rahat çalışıyorsa 1000 elemanda ne olur, bunu tahmin ederiz.",
      "O(1) sabit iş demektir. Bir sınıfta sadece öğretmenin masasındaki kaleme bakmak gibi: sınıfta 10 kişi de olsa 100 kişi de olsa senin işin değişmez. Dizide `dizi[3]` gibi doğrudan bir kutuya gitmek buna benzer.",
      "O(n) doğrusal iş demektir. Sınıftaki herkesi tek tek yoklamak gibi. 10 kişi varsa 10 kontrol, 100 kişi varsa 100 kontrol. Linear search bu yüzden O(n)'dir.",
      "O(n²) ise işin çok hızlı büyüdüğü durumdur. Her öğrencinin diğer herkesle tokalaşması gibi düşün. Kişi sayısı artınca tokalaşma sayısı patlar. Kodda iç içe iki `for` görürsen genelde O(n²) düşün.",
    ],
    exampleTitle: "Koddan Big O nasıl okunur?",
    exampleSteps: [
      "Kodda tek bir `for` döngüsü var mı bak. Varsa çoğu zaman O(n).",
      "Bir `for` döngüsünün içinde ikinci bir `for` varsa iş n kere n'e döner: O(n²).",
      "Kod her adımda aralığı ikiye bölüyorsa, örneğin binary search, O(log n) düşün.",
      "Sıralama sorularında Bubble, Selection, Insertion için O(n²); Quick Sort ortalama O(n log n), en kötü O(n²) bilgisini ayrı tut.",
    ],
  },
  stack: {
    paragraphs: [
      "Merhaba Umut. Stack yani yığın, günlük hayatta en kolay tabak yığınıyla anlaşılır. Masaya tabakları üst üste koyarsın. En son koyduğun tabak en üsttedir ve ilk onu alırsın.",
      "Bu yüzden stack mantığına LIFO denir: Last In, First Out. Türkçesi: Son giren ilk çıkar. Sınavda stack gördüğünde aklına ilk gelecek şey bu olmalı.",
      "`Push` yığına eleman ekler. `Pop` en üstteki elemanı çıkarır. `Peek` ise en üsttekine sadece bakar, çıkartmaz. Pop ve Peek farkı sınavda çok sık tuzak olur.",
      "Stack sorularını çözerken kafanda kod çalıştırmaya çalışma. Küçük bir dikey yığın çiz. Push gelince üste yaz, Pop gelince üsttekini sil, Peek gelince üsttekini oku.",
    ],
    exampleTitle: "Push, Pop, Peek adım adım",
    exampleSteps: [
      "`Push(5)` gelirse yığının en altına 5 yaz.",
      "`Push(2)` gelirse 2, 5'in üstüne gelir.",
      "`Push(8)` gelirse 8 en üsttedir.",
      "`Pop()` gelirse en üstteki 8 çıkar.",
      "Şimdi `Peek()` sorulursa tepede 2 kaldığı için cevap 2 olur.",
    ],
  },
  search: {
    paragraphs: [
      "Merhaba Umut. Bu dersi acele geçmiyoruz. Arama algoritması dediğimiz şey, elimizde bir veri grubu varken belirli bir değeri bulma yöntemidir. Veri yapıları dersinde arama çok temel bir fikirdir çünkü stack, queue, linked list, hash table, binary search gibi birçok konu aslında 'bir şeyi nasıl bulurum?' sorusuna farklı cevaplar verir.",
      "Önce en basit yöntemle başlayalım: Linear Search, yani doğrusal arama. Elinde karışık bir liste olduğunu düşün: `[5, 9, 2, 7]`. Aradığın değer 7 olsun. Bu liste sıralı değil. Böyle bir durumda akıllıca ortadan bakmak işe yaramaz; çünkü küçükler solda, büyükler sağda diye bir düzen yok. O yüzden en güvenli yöntem soldan başlayıp tek tek bakmaktır.",
      "Linear search çözümünü sınavda şöyle takip edeceksin: Birinci elemana bak, aranan mı? Değilse ikinciye geç. İkinci aranan mı? Değilse üçüncüye geç. Bulana kadar veya liste bitene kadar devam et. Bu yüzden aranan değer en sondaysa bütün listeyi gezersin. Aranan değer listede yoksa yine bütün listeyi gezersin. İşte bu yüzden linear search O(n)'dir.",
      "Buradaki O(n) şu demek: Eleman sayısı 4 ise en kötü 4 kontrol, eleman sayısı 100 ise en kötü 100 kontrol. Sınıfta bir öğrenciyi arıyorsun ve sınıf listesi karışık. Her sıraya tek tek bakmak zorundasın. Öğrenci en son sıradaysa bütün sınıfı dolaşırsın.",
      "Şimdi Binary Search'e geçelim. Binary Search, Linear Search'ten daha hızlıdır ama çok önemli bir şartı vardır: Dizi sıralı olmalıdır. Bu şartı ezber gibi değil, mantık gibi öğren. Binary search ortadaki elemana bakıp 'aradığım değer bundan küçük mü büyük mü?' diye karar verir. Eğer liste sıralı değilse bu kararın hiçbir anlamı kalmaz.",
      "Telefon rehberi örneği tam burada işe yarar. Rehber alfabetik olduğu için M harfindeysen ve Ali'yi arıyorsan sola gitmen gerektiğini bilirsin. Ama isimler karışık yazılmış bir kağıtta ortadan açıp 'Ali soldadır' diyemezsin. Çünkü düzen yoktur. Binary search'ün gücü sıralı olmasından gelir.",
      "Binary search adımları şöyledir: `low` başı gösterir, `high` sonu gösterir, `mid` ortayı gösterir. Ortadaki değer aranan değerse buldun. Aranan değer ortadakinden küçükse sağ tarafı çöpe atıp sola bakarsın. Aranan değer büyükse sol tarafı çöpe atıp sağa bakarsın. Her adımda arama alanı yaklaşık yarıya iner.",
      "Bu yüzden Binary Search O(log n)'dir. Log kelimesi korkutmasın. Burada pratik anlamı şu: 100 elemanı tek tek aramak yerine önce 50'sini, sonra 25'ini, sonra 12'sini, sonra 6'sını elemiş gibi düşün. Yani veri büyüse bile kontrol sayısı çok yavaş artar.",
      "Sınavda arama sorusu gelirse önce şu soruyu sor: Dizi sıralı mı? Sıralı değilse binary search seçeneği genelde yanlıştır. Sıralıysa ve `low`, `high`, `mid` kelimeleri varsa binary search düşün. Kodda tek `for` ile her elemana bakıyorsa linear search düşün.",
      "Arama algoritmalarıyla sıralama algoritmalarını karıştırma. Arama, 'bu değer var mı, varsa nerede?' sorusuna cevap verir. Sıralama ise dizinin düzenini değiştirir. Linear search normalde diziyi değiştirmez. Binary search de diziyi değiştirmez; sadece sıralı olduğu varsayılan dizide daha akıllı arar.",
    ],
    exampleTitle: "Linear ve Binary Search nasıl ayrılır?",
    exampleSteps: [
      "Dizi karışık verilmişse, örneğin `[5, 9, 2, 7]`, binary search düşünme. Linear search soldan sağa tek tek bakar.",
      "Linear search ile 7 aranıyorsa kontroller şu sıradadır: 5, 9, 2, 7. Yani 4. kontrolde bulunur.",
      "Dizi sıralı verilmişse, örneğin `[2, 4, 6, 8, 10]`, binary search mümkün hale gelir.",
      "Binary search önce ortaya bakar. Ortadaki değer 6'dır.",
      "Aranan 10 ise 10, 6'dan büyüktür. Sol taraf atılır, sağ tarafa geçilir.",
      "Sınavda ilk kararın her zaman 'dizi sıralı mı?' olsun. Bu karar yanlışsa bütün soru yanlış gider.",
    ],
  },
  queue: {
    paragraphs: [
      "Merhaba Umut. Queue yani kuyruk konusunu bu sefer yavaş yavaş kuracağız. Kuyruk, günlük hayatta bildiğin sıra mantığıdır: market kasasında, hastanede, yemekhane sırasında, yazıcı kuyruğunda ilk gelen kişi veya iş önce işlem görür.",
      "Queue'nun en önemli kuralı FIFO'dur: First In, First Out. Türkçesi: İlk giren ilk çıkar. Bu cümleyi ezberlemek yetmez; mantığını görmen lazım. Sıraya ilk giren kişi kasaya en yakın kişidir. Yeni gelenler onun önüne geçmez, sıranın arkasına eklenir.",
      "Queue'da iki uç vardır. Ön taraf yani `front`, çıkış kapısıdır. Arka taraf yani `rear`, giriş kapısıdır. Yeni eleman kuyruğa girerken arkaya eklenir. Eleman çıkarken önden çıkar. Bu yüzden queue'yu yatay çizmek stack'e göre çok daha anlaşılırdır.",
      "`Enqueue` kuyruğun arkasına eleman ekler. Bunu 'sıraya yeni kişi geldi ve en arkaya geçti' diye düşün. `Dequeue` kuyruğun önündeki elemanı çıkarır. Bunu 'kasadaki kişi işini bitirdi ve sıradan çıktı' diye düşün.",
      "`Peek` ise öndeki elemana sadece bakar. Yani kasada sıradaki kişi kim diye bakıyorsun ama kişiyi sıradan çıkarmıyorsun. `Dequeue` çıkarır, `Peek` çıkarmaz. Sınavda bu fark çok sık tuzak olur.",
      "Stack ile queue'yu karıştırmamak için iki resmi aklında tut: Stack tabak yığınıdır, en son gelen çıkar. Queue market sırasıdır, ilk gelen çıkar. Stack dikey düşünülür; queue yatay düşünülür.",
      "Queue işlem sorusu çözerken asla kafadan hızlı geçme. Sol tarafa `Ön`, sağ tarafa `Arka` yaz. `Enqueue` gelirse sağa ekle. `Dequeue` gelirse soldakini sil. `Peek` gelirse soldakini oku ama silme.",
    ],
    exampleTitle: "Kuyrukta geriye ne kalır?",
    exampleSteps: [
      "`Enqueue(5)` gelirse kuyruk: 5.",
      "`Enqueue(2)` gelirse 2 arkaya eklenir: 5, 2.",
      "`Enqueue(8)` gelirse kuyruk: 5, 2, 8.",
      "`Dequeue()` gelirse öndeki 5 çıkar.",
      "Geriye 2, 8 kalır.",
    ],
  },
  sorting: {
    paragraphs: [
      "Merhaba Umut. Sıralama algoritmaları, karışık sayıları küçükten büyüğe düzenleme yöntemleridir. Sınavda çoğu zaman senden algoritmayı ezberden yazman değil, adımlarını takip etmen beklenir.",
      "Bubble Sort yan yana duran iki sayıyı karşılaştırır. Büyük olan sağa geçer. Bir tur bittiğinde genelde en büyük eleman sona gitmiştir.",
      "Selection Sort her tur en küçük elemanı arar ve baştakiyle yer değiştirir. Bu algoritmada `min` veya `min_index` görürsen selection sort düşün.",
      "Insertion Sort elde kart dizmek gibidir. Yeni gelen kartı eldeki sıralı bölümde doğru yere sokarsın. Counting Sort ise karşılaştırma yapmaz; değerlerden kaç tane var sayar.",
      "Counting Sort için en önemli sınav bilgisi şudur: küçük aralıklı, negatif olmayan tam sayılarda mantıklıdır. Değer aralığı çok büyükse veya negatif sayılar varsa doğrudan kullanmak saçma olabilir.",
      "Sıralama sorularında en büyük tehlike algoritmaları isim olarak ezberleyip adımı kaçırmaktır. Bubble Sort komşu komşu gider. Selection Sort kalan bölümde en küçüğü seçer. Insertion Sort elindeki kartları yerleştirir gibi yeni geleni doğru yere sokar. Quick Sort pivot seçip küçükleri bir tarafa, büyükleri bir tarafa ayırır. Counting Sort ise karşılaştırmadan önce kaç tane 0 var, kaç tane 1 var, kaç tane 2 var diye sayar.",
      "Vize fotoğrafındaki gibi bir soru gelirse genelde '1. turdan sonra dizi ne olur?' diye sorulur. Bu durumda algoritmanın bütününü değil, sadece ilk turu simüle edeceksin. Bubble Sort'ta ilk tur en büyüğü sona taşır. Selection Sort'ta ilk tur en küçüğü başa taşır. Bu iki cümle çok puan kurtarır.",
    ],
    exampleTitle: "Selection Sort ilk tur",
    exampleSteps: [
      "Dizi: `[5, 1, 8, 3]`.",
      "Selection Sort ilk turda tüm diziye bakıp en küçüğü arar.",
      "En küçük değer 1'dir.",
      "1 ile ilk eleman olan 5 yer değiştirir.",
      "İlk turdan sonra dizi `[1, 5, 8, 3]` olur.",
    ],
  },
  hash: {
    paragraphs: [
      "Merhaba Umut. Hash table'ı öğrenci dolapları gibi düşün. Her öğrencinin numarasından bir dolap numarası hesaplanıyor. Böylece öğrenciyi tek tek aramak yerine doğrudan dolabına gidebiliyorsun.",
      "Hash fonksiyonu, verilen değerden bir indeks üretir. Örneğin `key % 10` gibi mod alma işlemiyle 0-9 arası bir kova seçilebilir.",
      "Çarpışma, iki farklı değerin aynı kovaya düşmesidir. Mesela 12 % 10 = 2 ve 22 % 10 = 2. İkisi de 2 numaralı kovaya gitmek ister.",
      "Çarpışmayı çözmek için zincirleme veya açık adresleme kullanılır. Zincirleme aynı kovada liste tutar. Açık adresleme ise başka boş kova arar.",
      "Final listende özellikle çarpışmayla başa çıkma yöntemleri var. Burada dört ismi bilmen gerekiyor: chaining yani zincirleme, linear probing, quadratic probing ve double hashing. Zincirleme farklıdır; aynı kovada küçük bir liste tutar. Diğer üçü açık adresleme ailesindedir; yani aynı kovaya sığmayınca tabloda başka boş yer arar.",
      "Linear probing en basit açık adresleme yöntemidir: doluysa bir sonraki kovaya bak, o da doluysa bir sonrakine bak. Quadratic probing daha farklı zıplar: 1², 2², 3² gibi uzaklıklara bakar. Double hashing ise ikinci bir hash fonksiyonu kullanarak kaç adım zıplayacağını belirler.",
      "Hash sorusunda tablo boyutu ve mod işlemi verilirse önce kalan hesabı yap. Örneğin tablo boyutu 5 ise 12'nin kovası `12 % 5 = 2` olur. Aynı kovaya başka değer de gelirse çarpışma var de. Sonra soruda verilen yönteme göre yerleştirmeyi sürdür.",
    ],
    exampleTitle: "Mod ile kova bulma",
    exampleSteps: [
      "Tablo boyutu 10 olsun.",
      "12 için `12 % 10` hesapla. Kalan 2, yani kova 2.",
      "22 için `22 % 10` hesapla. Kalan yine 2.",
      "İki değer aynı kovayı istediği için çarpışma oluşur.",
      "Zincirleme kullanılırsa kova 2 içinde 12 ve 22 birlikte tutulur.",
    ],
  },
  "linked-list": {
    paragraphs: [
      "Merhaba Umut. Linked list yani bağlı listeyi tren vagonları gibi düşün. Her vagonun içinde bir yük vardır ve bir sonraki vagonu gösteren bağlantı bulunur.",
      "Dizide elemanlar bellekte yan yana durur. Bu yüzden `dizi[5]` gibi doğrudan gitmek kolaydır. Linked listte ise beşinci düğüme gitmek için baştan başlayıp bağlantıları takip edersin.",
      "Linked listin avantajı ekleme ve silmede ortaya çıkar. Araya yeni vagon eklemek için bütün trenin yerini kaydırmazsın; bağlantıları değiştirirsin.",
      "Dezavantajı ise arama ve ekstra bellektir. Her düğüm sadece veriyi değil, bir sonraki düğümün bağlantısını da tutar. Bu yüzden diziye göre daha fazla bellek kullanabilir.",
      "Sınavda linked list sorularında `head`, `tail`, `next`, `node` kelimeleri çok önemlidir. `head` listenin ilk düğümünü gösterir. `tail` varsa son düğümü gösterir. `next`, bir düğümden sonraki düğüme giden bağlantıdır. Bu kelimeleri görünce kafanda tren vagonu çiz.",
      "Maliyet sorularında şu ayrımı yap: Head biliniyorsa başa ekleme O(1)'dir. Çünkü yeni düğümü başa koyup iki bağlantı değiştirirsin. Ama belirli bir değeri bulmak veya beşinci düğüme ulaşmak için baştan gezmen gerekir; bu O(n)'dir. Tail yoksa sona eklemek de son düğümü bulmak için O(n) olabilir.",
      "Diziye göre avantajı: araya ekleme/silme bağlantı değiştirerek yapılabilir, büyük kaydırma gerekmeyebilir. Dezavantajı: doğrudan indeksle erişim yoktur ve her düğüm bağlantı bilgisi tuttuğu için ekstra bellek kullanır.",
    ],
    exampleTitle: "Araya düğüm ekleme fikri",
    exampleSteps: [
      "Elinde A -> C listesi olsun.",
      "Araya B eklemek istiyorsun.",
      "A'nın `next` bağlantısı önce C'yi gösteriyordu.",
      "B'nin `next` bağlantısını C yaparsın.",
      "A'nın `next` bağlantısını B yaparsın. Artık liste A -> B -> C olur.",
    ],
  },
  "circular-doubly": {
    paragraphs: [
      "Merhaba Umut. Şimdi linked listin iki özel halini düşünelim. Tek yönlü listede her düğüm sadece sonrakini bilir. Çift yönlü listede ise hem sonrakini hem öncekini bilir.",
      "Çift yönlü listeyi çift yönlü tren hattı gibi düşün. İleri de gidebilirsin, geri de dönebilirsin. Bu büyük avantajdır ama her vagona ikinci bağlantı eklediğin için bellek maliyeti artar.",
      "Dairesel listede son düğüm tekrar başa bağlanır. Ring servis gibi: son durağa gelince sistem bitmez, tekrar ilk durağa döner.",
      "Sınavda çift yönlü listenin dezavantajı sorulursa: ekstra bellek ve bağlantı güncelleme karmaşıklığı. Dairesel liste sorulursa: son düğümün başa bağlandığını hatırla.",
    ],
    exampleTitle: "Dairesel listeyi tanıma",
    exampleSteps: [
      "Normal listede son düğümün `next` değeri genelde boştur.",
      "Dairesel listede son düğüm boşu göstermez.",
      "Son düğüm tekrar ilk düğümü gösterir.",
      "Bu yüzden gezme işlemi dikkatli yapılmazsa sonsuz döngüye girebilir.",
    ],
  },
  "functions-string": {
    paragraphs: [
      "Merhaba Umut. Fonksiyon, belirli bir işi yapan küçük kod makinesidir. Mesela kare alan bir makine düşün: içine 5 verirsin, sana 25 verir.",
      "Fonksiyonun adı, parametresi ve dönüş değeri vardır. `int kare(int x)` ifadesinde fonksiyonun adı kare, aldığı değer x, döndürdüğü tür int'tir.",
      "String ise metindir. Ama C# açısından metni karakterlerin yan yana dizildiği bir yapı gibi düşünebilirsin. `\"umut\"` metninde karakterler u, m, u, t diye sıralanır.",
      "`Length` uzunluğu verir. `ToUpper()` büyük harfe, `ToLower()` küçük harfe çevirir. `Split(' ')` boşluklardan parçalar. Sınavda bu metot isimlerini tanıman çok puan getirir.",
    ],
    exampleTitle: "Split nasıl düşünülür?",
    exampleSteps: [
      "Metin: `ali veli fatma`.",
      "`Split(' ')` boşluk gördüğü yerden keser.",
      "İlk parça `ali`, ikinci parça `veli`, üçüncü parça `fatma` olur.",
      "Bu yüzden sonuçta 3 parça vardır.",
    ],
  },
  trees: {
    paragraphs: [
      "Merhaba Umut. Ağaç konusu finalde düşük öncelikli; hocanın notunda rotasyon yok. Bu yüzden AVL rotasyonu gibi detaylara girmiyoruz. Kök, yaprak, sol-sağ çocuk ve BST mantığını bilmen yeterli.",
      "Ağaç, doğrusal olmayan bir yapıdır. Dizi, stack, queue gibi tek sıra halinde ilerlemez. Bir düğümden birden fazla dala ayrılabilir.",
      "Binary tree'de her düğümün en fazla iki çocuğu vardır: sol ve sağ. Binary Search Tree yani BST'de ise küçük değerler sola, büyük değerler sağa gider.",
      "BST'de arama yaparken kökten başlarsın. Aradığın değer küçükse sola, büyükse sağa gidersin. Dengeli bir ağaçta bu işlem O(log n) kadar hızlı olabilir.",
    ],
    exampleTitle: "BST'de yön seçme",
    exampleSteps: [
      "Kök değer 8 olsun.",
      "Aranan değer 3 ise 3, 8'den küçüktür; sola gidersin.",
      "Aranan değer 10 ise 10, 8'den büyüktür; sağa gidersin.",
      "Sınavda BST için ana kural: sol küçük, sağ büyük.",
    ],
  },
};

const lessonDeepDives: Record<string, string[]> = {
  csharp: [
    "Şimdi `if` yapısını da çok temel seviyede oturtalım. `if`, bilgisayarın karar kapısıdır. Mesela `if (not >= 50)` yazıyorsa bilgisayar şunu sorar: not 50 veya daha büyük mü? Cevap evetse süslü parantezin içindeki kod çalışır, değilse çalışmaz.",
    "`return` kelimesini gördüğünde 'fonksiyon burada sonucunu verip çıkıyor' diye düşün. Bir makineye sayı veriyorsun, makine hesap yapıyor ve sana sonuç fişi veriyor. `return x * x;` bu sonuç fişidir. `void` fonksiyonda ise sonuç fişi yoktur; sadece ekrana yazdırmak gibi bir iş yapar.",
    "`Console.WriteLine` sınavda çıktı sorularında çok önemlidir. `WriteLine` yazdıktan sonra alt satıra geçer. `Write` ise aynı satırda devam eder. Hoca kod verip 'ekrana ne yazar?' dediğinde önce değişkenleri takip et, sonra yazdırılan ifadeyi bul.",
    "Döngü sorularında üç parçayı ayrı oku: başlangıç, koşul, artış. `int i = 0` başlangıçtır. `i < 4` devam şartıdır. `i++` her turdan sonra 1 artır demektir. Sınavda kafan karışırsa i değerlerini yan yana yaz: 0, 1, 2, 3.",
  ],
  "big-o": [
    "Big O'da amaç milisaniye hesaplamak değildir. Bilgisayarın markası, hızı, RAM'i değişebilir; ama algoritmanın büyüme davranışı değişmez. Bu yüzden Big O sınavda 'yaklaşık kaç iş yapar?' sorusunun dilidir.",
    "O(1), O(log n), O(n), O(n log n), O(n²) sıralamasını ezber gibi değil, merdiven gibi düşün. En altta sabit iş var. Sonra yarıya bölen işler var. Sonra tek tek gezen işler var. Sonra iyi sıralamalar geliyor. En sonda iç içe döngü gibi hızlı büyüyen işler var.",
    "Kod okurken küçük sabitleri önemseme. Bir kodda önce bir döngü, sonra bir döngü daha varsa toplam O(n) + O(n) olur; Big O dilinde bu yine O(n) diye söylenir. Çünkü veri büyüyünce önemli olan baskın büyüme davranışıdır.",
    "Uzay karmaşıklığı da final listesinde geçebilir. Zaman karmaşıklığı 'kaç işlem?' diye sorar. Uzay karmaşıklığı 'ne kadar ek bellek?' diye sorar. Yeni bir dizi oluşturuyorsan ekstra alan kullanıyorsun demektir.",
  ],
  stack: [
    "Stack'i sadece tabak olarak değil, tarayıcı geri tuşu gibi de düşün. Yeni sayfaya gittikçe sayfalar yığına eklenir. Geri dediğinde en son açtığın sayfa çıkar ve bir önceki sayfaya dönersin.",
    "Parantez kontrolü stack'in klasik örneğidir. `(` görünce stack'e koyarsın. `)` görünce stack'ten bir tane çıkarırsın. En sonda stack boşsa parantezler dengeli olabilir. Boşken kapama parantezi gelirse hata vardır.",
    "Sınavda stack işlem dizisi çözmenin en sağlam yolu dikey çizimdir. En alta ilk geleni, üste son geleni yaz. `Push` gelince yukarı ekle. `Pop` gelince en üsttekini sil. `Peek` gelince silmeden en üsttekini oku.",
    "Stack'te baştan, sondan, ortadan seçme yoktur. Tek aktif nokta tepedir. Bu yüzden stack sorularında 'en alttaki çıkar' gibi seçenekler genelde tuzaktır.",
  ],
  search: [
    "Linear search kodunda genellikle `for` döngüsü ve `if (dizi[i] == aranan)` gibi bir kontrol görürsün. Bu kodun mantığı şudur: i değişkeni sırayla bütün kutulara gider ve her kutuda 'aradığım bu mu?' diye sorar.",
    "Binary search kodunda ise `low`, `high`, `mid` kelimeleri çok belirgindir. `mid = (low + high) / 2` ortayı bulur. Eğer `dizi[mid]` aranan değerden küçükse `low = mid + 1` yapılır; yani sol taraf artık çöpe atılmış olur.",
    "Binary search'te en çok yapılan hata, sıralı olmayan dizide de çalışacağını sanmaktır. Sınavda seçeneklerde 'ikili arama sıralı dizilerde kullanılır' gibi bir ifade görürsen bu genelde doğru bilgidir.",
    "Arama sorularında 'kaçıncı adımda bulunur?' denirse animasyon gibi takip et: linear search için soldan say, binary search için orta değerleri sırayla yaz. Tahmin etme; küçük tablo çiz.",
  ],
  queue: [
    "Yazıcı kuyruğu örneği de çok iyi çalışır. Bir sınıfta üç kişi aynı yazıcıya belge gönderdi diyelim. İlk belge önce basılır. Son belge yazıcıya sonradan geldiği için sıranın arkasında bekler. Bilgisayar bunu queue ile temsil eder.",
    "Sınavda `Enqueue(5), Enqueue(2), Dequeue(), Peek()` gibi soru görünce önce boş kuyruk çiz. Her işlemi tek tek uygula. `Enqueue(5)` sonrası kuyruk 5 olur. `Enqueue(2)` sonrası 5, 2 olur. `Dequeue()` 5'i çıkarır. `Peek()` artık 2'yi gösterir.",
    "Queue ile stack arasındaki farkı işlem üzerinden düşün. `Push(5), Push(2), Pop()` stack'te 2'yi çıkarır. Ama `Enqueue(5), Enqueue(2), Dequeue()` queue'da 5'i çıkarır. Aynı sayılar, farklı veri yapısı, farklı sonuç.",
    "Dizi tabanlı kuyrukta önden eleman silmek bazen maliyetlidir çünkü kalan elemanları sola kaydırman gerekebilir. Bu yüzden bazı kuyruk uygulamalarında `front` ve `rear` indisleri tutulur. Böylece elemanları sürekli kaydırmak yerine ön ve arka göstergeleri hareket ettirilir.",
    "Dairesel kuyruk fikri de buradan doğar. Dizinin sonuna gelince boş yer varsa başa sarabilirsin. Ama bu finalde asıl odak temel queue işlemleri: Enqueue arkaya, Dequeue öne, Peek öne bakar.",
  ],
  sorting: [
    "Bubble Sort'ta bir turu takip ederken sadece komşu iki elemanı karşılaştır. Bütün diziyi tek hamlede sıralamaya çalışma. Büyük olan sağa doğru kabarcık gibi ilerler.",
    "Selection Sort'ta zihninde iki bölge kur: sol taraf sıralanmış/kesinleşmiş bölüm, sağ taraf hâlâ aranacak bölüm. Her tur sağ taraftaki en küçüğü bulup sıradaki boş yere koyarsın.",
    "Insertion Sort'ta da iki bölge vardır ama mantık farklıdır. Sol taraf eldeki sıralı kartlar gibidir. Sağdan yeni bir kart alırsın ve soldaki sıralı bölümde doğru yere sokarsın.",
    "Quick Sort'ta pivot kelimesi çok önemlidir. Pivot seçilir, pivotun küçükleri bir tarafa, büyükleri diğer tarafa alınır. Hocanın vize tarzında en kötü durum O(n²), ortalama O(n log n) bilgisi sorulabilir.",
    "Counting Sort'ta karşılaştırma yoktur. Bu yüzden Bubble/Selection gibi 'hangisi büyük?' diye sormaz. Bunun yerine değerleri sayar. Küçük aralıklı tam sayılarda çok mantıklıdır; aralık devasa ise sayma dizisi gereksiz büyür.",
  ],
  hash: [
    "Hash table'ın amacı doğrudan adrese gitmektir. Dizi gibi indeks kullanır ama indeksi elle sen vermezsin; hash fonksiyonu üretir. Bu yüzden ortalama durumda arama/ekleme/silme O(1) kabul edilir.",
    "Mod alma sınavda sık gelir. `key % tabloBoyutu` ifadesi kalan bulur. Tablo boyutu 10 ise sonuç 0 ile 9 arasında olur. Çünkü 10 kovayı 0'dan 9'a numaralandırıyoruz.",
    "Çarpışma kötü bir şeydir ama normaldir. Hash table dünyasında iki kişinin aynı dolabı istemesi gibi düşün. İyi hash fonksiyonu çarpışmayı azaltır ama tamamen yok edeceğini garanti etmez.",
    "Zincirleme yönteminde aynı kovada liste tutulur. Yani 2 numaralı kovada sadece tek değer değil, 12 -> 22 gibi küçük bir bağlı liste olabilir. Bu yüzden linked list bilgisi hash konusuna bağlanır.",
    "Açık adreslemede kovanın içinde liste açılmaz. Tablo içinde başka boş yer aranır. Linear probing düz gider, quadratic probing kareli zıplar, double hashing ikinci hash fonksiyonuyla zıplama miktarı belirler.",
  ],
  "linked-list": [
    "Linked listte her düğüm iki parçalı gibi düşünülebilir: veri ve bağlantı. Veri düğümün taşıdığı sayıdır. Bağlantı ise bir sonraki düğümün adresidir. Bu yüzden düğümler bellekte yan yana olmak zorunda değildir.",
    "Dizi ile linked list arasındaki en büyük fark erişim şeklidir. Dizide üçüncü kutuya doğrudan gidersin. Linked listte üçüncü düğüme gitmek için birinci bağlantı, ikinci bağlantı, üçüncü bağlantı diye yürürsün.",
    "Araya ekleme mantığını unutma: Yeni düğümü oluşturursun, yeni düğümün `next` bağlantısını sonraki düğüme verirsin, önceki düğümün `next` bağlantısını yeni düğüme çevirirsin. Yer değiştiren şey elemanlar değil, oklar yani bağlantılardır.",
    "Silme işleminde de benzer şekilde bağlantı atlatılır. A -> B -> C listesinden B silinecekse A'nın `next` bağlantısı C yapılır. B artık listeden kopar.",
    "Linked list avantaj/dezavantaj sorularında dengeli düşün. Avantaj: ekleme/silmede kaydırma yok. Dezavantaj: indeksle direkt erişim yok, ekstra bağlantı belleği var.",
  ],
  "circular-doubly": [
    "Dairesel listeyi normal linked listten ayıran şey son düğümdür. Normal listede son düğümün `next` değeri boştur. Dairesel listede son düğüm tekrar başı gösterir.",
    "Bu yapı ring servis gibi çalışır. Son durağa geldin diye sistem bitmez; tekrar ilk durağa dönersin. Bu bazı uygulamalarda yararlıdır ama gezme işlemini durdurmazsan sonsuz döngüye girersin.",
    "Çift yönlü listede her düğüm sadece sonrakini değil, öncekini de bilir. Bu yüzden geriye doğru yürümek kolaylaşır. Ama her düğüm iki bağlantı tuttuğu için bellek maliyeti artar.",
    "Sınavda çift yönlü liste dezavantajı sorulursa iki cevap güçlüdür: ekstra bellek ve bağlantı güncelleme karmaşıklığı. Çünkü ekleme/silmede hem `next` hem `prev` doğru ayarlanmalıdır.",
  ],
  "functions-string": [
    "Fonksiyon sorularında imzayı okumayı öğren. `public static int kare(int x)` ifadesinde dönüş türü `int`, fonksiyon adı `kare`, parametre `x`'tir. Sınavda fonksiyona verilen değeri x yerine koyup sonucu hesapla.",
    "`void` fonksiyon değer döndürmez. Bu yüzden `return 5;` gibi bir sonuç bekleme. `void` fonksiyon genelde ekrana yazma, listeyi değiştirme veya bir işi yapıp bitirme amacı taşır.",
    "String karakter karakter okunabilir. `string txt = \"abcd\";` ise `txt[0]` a, `txt[1]` b, `txt[2]` c olur. Burada da indis 0'dan başlar.",
    "String ters çevirme sorusunda temel fikir sondan başa okumaktır. `for (int i = metin.Length - 1; i >= 0; i--)` gibi bir döngü görürsen tersine okuma düşün.",
    "`Split` parçalama demektir. `Split(' ')` boşluktan böler, `Split(',')` virgülden böler. `ToUpper` büyütür, `ToLower` küçültür. Bunları sınavda metot ismi olarak tanıman yeterli olabilir.",
  ],
  trees: [
    "Ağaçları bu finalde düşük öncelikli tutuyoruz ama temel kavramları boş bırakmıyoruz. Kök en üst düğümdür. Yaprak, çocuğu olmayan düğümdür. Parent ebeveyn, child çocuk düğümdür.",
    "Binary tree ile BST aynı şey değildir. Binary tree sadece her düğümün en fazla iki çocuğu olduğunu söyler. BST ise ayrıca sıralama kuralı koyar: küçükler sol, büyükler sağ.",
    "BST aramasında her adımda yön seçersin. Aranan değer kökten küçükse sola, büyükse sağa gidersin. Bu yön seçme mantığı binary search'e benzer; ikisi de düzen bilgisinden faydalanır.",
    "Hocanın notunda rotasyon yok denmişti. Bu yüzden AVL sağa/sola döndürme gibi detayları burada büyütmüyoruz. Sınav için kök, yaprak, sol-sağ çocuk ve BST yön kuralı öncelikli.",
  ],
};

const lessonInlineVisuals: Record<string, Record<number, string[]>> = {
  csharp: { 2: ["code"], 7: ["code"] },
  "big-o": { 1: ["growth"], 5: ["growth"] },
  stack: { 2: ["stack"], 6: ["stack"] },
  search: { 2: ["linear-search"], 6: ["search"], 8: ["search-choice"] },
  queue: { 1: ["queue"], 6: ["queue"], 10: ["queue-array"] },
  sorting: { 1: ["bubble-pass"], 2: ["sorting"], 4: ["counting-sort"] },
  hash: { 2: ["hash"], 8: ["linear-probing"] },
  "linked-list": { 2: ["linked"], 8: ["linked-cost"] },
  "circular-doubly": { 2: ["circular"], 6: ["circular"] },
  "functions-string": { 2: ["string"], 7: ["string"] },
  trees: { 2: ["tree"], 6: ["tree"] },
};

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function getStoredProgress() {
  if (typeof window === "undefined") return initialProgress;
  const raw = window.localStorage.getItem("vy-final-progress");
  if (!raw) return initialProgress;
  try {
    return { ...initialProgress, ...JSON.parse(raw) } as ProgressState;
  } catch {
    return initialProgress;
  }
}

export default function Home() {
  const [selectedLessonId, setSelectedLessonId] = useState(lessons[0].id);
  const [activeStep, setActiveStep] = useState<LessonStep>("learn");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [explanationMode, setExplanationMode] = useState<Record<string, "short" | "simple" | "exam">>({});
  const [progress, setProgress] = useState<ProgressState>(initialProgress);
  const [activeMode, setActiveMode] = useState<ActiveMode>("lesson");
  const [examVersion, setExamVersion] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Takıldığın yeri yaz. Mesela: 'Stack ile Queue farkını hiç anlamadım.' Önce benzetmeyle anlatırım, sonra mini soru sorarım.",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  const selectedLesson = lessons.find((lesson) => lesson.id === selectedLessonId) ?? lessons[0];
  const selectedLessonIndex = lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
  const examQuestions = useMemo(() => getExamQuestions(examVersion), [examVersion]);
  const completedCount = progress.completedLessons.length;
  const completionRate = Math.round((completedCount / lessons.length) * 100);

  const wrongQuestions = useMemo(
    () => progress.wrong.map((id) => examBank.find((q) => q.id === id)).filter(Boolean) as PracticeQuestion[],
    [progress.wrong],
  );

  const weakTopics = useMemo(() => {
    const counts = new Map<string, number>();
    wrongQuestions.forEach((question) => counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [wrongQuestions]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setProgress(getStoredProgress());
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("vy-final-progress", JSON.stringify(progress));
  }, [progress]);

  function openLesson(lessonId: string) {
    setSelectedLessonId(lessonId);
    setActiveMode("lesson");
    setActiveStep("learn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function markLessonComplete(lessonId = selectedLesson.id) {
    setProgress((current) => ({
      ...current,
      completedLessons: unique([...current.completedLessons, lessonId]),
    }));
  }

  function moveLesson(direction: 1 | -1) {
    const nextIndex = selectedLessonIndex + direction;
    if (nextIndex < 0 || nextIndex >= lessons.length) return;
    openLesson(lessons[nextIndex].id);
  }

  function answerQuestion(question: PracticeQuestion, option: string) {
    const correct = option === question.answer;
    setSelectedAnswers((current) => ({ ...current, [question.id]: option }));
    setExplanationMode((current) => ({ ...current, [question.id]: current[question.id] ?? "short" }));
    setProgress((current) => {
      const wrong = correct ? current.wrong.filter((id) => id !== question.id) : unique([...current.wrong, question.id]);
      const answered = { ...current.answered, [question.id]: correct };
      const examAnswered = examQuestions.filter((q) => selectedAnswers[q.id] || q.id === question.id);
      const examCorrect = examAnswered.filter((q) => (q.id === question.id ? correct : current.answered[q.id])).length;
      return {
        ...current,
        answered,
        wrong,
        lastExamScore: activeMode === "exam" ? examCorrect : current.lastExamScore,
      };
    });
  }

  async function sendChat() {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading) return;

    const nextMessages: ChatMessage[] = [...chatMessages, { role: "user", content: trimmed }];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson: selectedLesson.title,
          prompt: trimmed,
          messages: nextMessages.slice(-6),
        }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ??
            data.error ??
            "Şu an AI cevap veremedi. Ders akışı çalışmaya devam ediyor; aynı sorunun 'Çocuk gibi anlat' açıklamasına bakabilirsin.",
        },
      ]);
    } catch {
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "AI bağlantısı kurulamadı. Bu sadece yardım panelini etkiler; dersler ve sorular cihazında çalışır.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="learning-shell">
      <header className="course-header">
        <button className="brand-button" onClick={() => setActiveMode("lesson")}>
          <span className="brand-mark">VY</span>
          <span>
            <strong>Final Koçu</strong>
            <small>Sıfırdan, adım adım</small>
          </span>
        </button>

        <div className="header-progress" aria-label="Genel ilerleme">
          <span>{completedCount}/{lessons.length} ders</span>
          <div className="progress-track">
            <span style={{ width: `${completionRate}%` }} />
          </div>
          <strong>{completionRate}%</strong>
        </div>

        <div className="header-actions">
          <button className={activeMode === "exam" ? "header-action active" : "header-action"} onClick={() => setActiveMode("exam")}>
            <Target size={16} /> Final denemesi
          </button>
          <button className={activeMode === "cram" ? "header-action active" : "header-action"} onClick={() => setActiveMode("cram")}>
            <Clock3 size={16} /> Son saat
          </button>
          <button className={showHelp ? "header-action active" : "header-action"} onClick={() => setShowHelp((value) => !value)}>
            <MessageCircle size={16} /> Anlamadım
          </button>
        </div>
      </header>

      <div className="learning-layout">
        <aside className="course-map" aria-label="Ders haritası">
          <div className="map-heading">
            <strong>Ders yolu</strong>
            <span>{lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)} dk plan</span>
          </div>
          <nav>
            {lessons.map((lesson, index) => {
              const active = activeMode === "lesson" && lesson.id === selectedLesson.id;
              const done = progress.completedLessons.includes(lesson.id);
              return (
                <button className={active ? "map-item active" : "map-item"} key={lesson.id} onClick={() => openLesson(lesson.id)}>
                  <span className={done ? "map-dot done" : "map-dot"}>{done ? <CheckCircle2 size={14} /> : index + 1}</span>
                  <span>
                    <strong>{lesson.shortTitle}</strong>
                    <small>{lesson.minutes} dk · {lesson.practice.length} soru</small>
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="coverage-card">
            <strong>Kapsam kontrolü</strong>
            <p>{lessons.length} ders, {examBank.length} soru, 5 farklı 20 soruluk deneme. Dersler temelden başlar; her konu bir sonrakinin altyapısını kurar.</p>
          </div>
        </aside>

        <section className="reader">
          {activeMode === "lesson" ? (
            <LessonReader
              lesson={selectedLesson}
              lessonIndex={selectedLessonIndex}
              step={activeStep}
              setStep={setActiveStep}
              selectedAnswers={selectedAnswers}
              explanationMode={explanationMode}
              answerQuestion={answerQuestion}
              setExplanationMode={setExplanationMode}
              markLessonComplete={markLessonComplete}
              moveLesson={moveLesson}
            />
          ) : activeMode === "exam" ? (
            <ExamMode
              questions={examQuestions}
              selectedAnswers={selectedAnswers}
              explanationMode={explanationMode}
              progress={progress}
              answerQuestion={answerQuestion}
              setExplanationMode={setExplanationMode}
              weakTopics={weakTopics}
              examVersion={examVersion}
              setExamVersion={setExamVersion}
            />
          ) : (
            <CramPanel />
          )}

          {showHelp ? (
            <HelpPanel
              chatMessages={chatMessages}
              chatInput={chatInput}
              chatLoading={chatLoading}
              setChatInput={setChatInput}
              sendChat={sendChat}
              wrongQuestions={wrongQuestions}
            />
          ) : null}
        </section>
      </div>
    </main>
  );
}

function LessonReader({
  lesson,
  lessonIndex,
  step,
  setStep,
  selectedAnswers,
  explanationMode,
  answerQuestion,
  setExplanationMode,
  markLessonComplete,
  moveLesson,
}: {
  lesson: (typeof lessons)[number];
  lessonIndex: number;
  step: LessonStep;
  setStep: (step: LessonStep) => void;
  selectedAnswers: Record<string, string>;
  explanationMode: Record<string, "short" | "simple" | "exam">;
  answerQuestion: (question: PracticeQuestion, option: string) => void;
  setExplanationMode: React.Dispatch<React.SetStateAction<Record<string, "short" | "simple" | "exam">>>;
  markLessonComplete: () => void;
  moveLesson: (direction: 1 | -1) => void;
}) {
  const firstQuestion = lesson.practice[0];
  const script = lessonScripts[lesson.id];

  return (
    <article className="lesson-reader">
      <div className="lesson-hero">
        <span>Ders {lessonIndex + 1}</span>
        <h1>{lesson.title}</h1>
        <p>{lesson.hook}</p>
      </div>

      <div className="stepper">
        {(Object.keys(stepLabels) as LessonStep[]).map((item) => (
          <button className={step === item ? "step active" : "step"} key={item} onClick={() => setStep(item)}>
            {stepLabels[item]}
          </button>
        ))}
      </div>

      {step === "learn" ? (
        <section className="learning-card">
          <TeacherLesson lesson={lesson} script={script} />
          <div className="lesson-actions">
            <button className="ghost-action" disabled>
              <ChevronLeft size={16} /> Önceki
            </button>
            <button className="primary-action" onClick={() => setStep("example")}>
              Örnek çözüme geç <ChevronRight size={16} />
            </button>
          </div>
        </section>
      ) : null}

      {step === "example" ? (
        <section className="learning-card">
          <WorkedExample script={script} />
          <NarrativeBlock icon={<Sparkles size={20} />} title="Gerçek hayatla bağla" body={lesson.analogy} />
          <NarrativeBlock icon={<Code2 size={20} />} title="Kodda görünce böyle oku" body={lesson.codeReading} />
          <InlineCheckpoint
            title="Beraber çözelim"
            question={firstQuestion}
            selected={selectedAnswers[firstQuestion.id]}
            mode={explanationMode[firstQuestion.id] ?? "exam"}
            onAnswer={(option) => answerQuestion(firstQuestion, option)}
            onMode={(mode) => setExplanationMode((current) => ({ ...current, [firstQuestion.id]: mode }))}
          />
          <div className="lesson-actions">
            <button className="ghost-action" onClick={() => setStep("learn")}>
              <ChevronLeft size={16} /> Anlatıma dön
            </button>
            <button className="primary-action" onClick={() => setStep("practice")}>
              Kendim deneyeceğim <ChevronRight size={16} />
            </button>
          </div>
        </section>
      ) : null}

      {step === "practice" ? (
        <section className="learning-card">
          <div className="section-title">
            <ListChecks size={20} />
            <div>
              <h2>Kendin dene</h2>
              <p>Önce cevapla, sonra açıklama seviyesini değiştir.</p>
            </div>
          </div>
          <div className="question-stack">
            {lesson.practice.map((question, index) => (
              <QuestionCard
                key={question.id}
                index={index + 1}
                question={question}
                selected={selectedAnswers[question.id]}
                mode={explanationMode[question.id] ?? "short"}
                onAnswer={(option) => answerQuestion(question, option)}
                onMode={(mode) => setExplanationMode((current) => ({ ...current, [question.id]: mode }))}
              />
            ))}
          </div>
          <div className="lesson-actions">
            <button className="ghost-action" onClick={() => setStep("example")}>
              <ChevronLeft size={16} /> Örneğe dön
            </button>
            <button className="primary-action" onClick={() => setStep("summary")}>
              Sınav özetine geç <ChevronRight size={16} />
            </button>
          </div>
        </section>
      ) : null}

      {step === "summary" ? (
        <section className="learning-card">
          <NarrativeBlock icon={<Target size={20} />} title="Sınavda böyle çıkar" body={lesson.examPattern} />
          <div className="must-know">
            <h2>Mutlaka bil</h2>
            <ul>
              {lesson.mustKnow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="lesson-actions">
            <button className="ghost-action" onClick={() => moveLesson(-1)}>
              <ChevronLeft size={16} /> Önceki ders
            </button>
            <button className="primary-action" onClick={markLessonComplete}>
              <CheckCircle2 size={17} /> Bu dersi tamamladım
            </button>
            <button className="ghost-action" onClick={() => moveLesson(1)}>
              Sonraki ders <ChevronRight size={16} />
            </button>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function TeacherLesson({
  lesson,
  script,
}: {
  lesson: (typeof lessons)[number];
  script?: LessonScript;
}) {
  const baseParagraphs = script?.paragraphs ?? [
    `Merhaba Umut. Bu derste ${lesson.title} konusunu en baştan kuracağız.`,
    lesson.concept,
    lesson.analogy,
    "Soru çözmeden önce bu fikrin günlük hayattaki karşılığını ve sınavda hangi kelimelerle geldiğini anlaman önemli.",
  ];
  const paragraphs = [...baseParagraphs, ...(lessonDeepDives[lesson.id] ?? [])];
  const inlineVisuals = lessonInlineVisuals[lesson.id] ?? { 1: [lesson.visual] };

  return (
    <section className="teacher-lesson">
      <div className="section-title">
        <BookOpen size={22} />
        <div>
          <h2>Hoca anlatımı</h2>
          <p>Bu bölümde soru yok. Önce konuyu kafanda oturtuyoruz.</p>
        </div>
      </div>
      <div className="teacher-copy">
        {paragraphs.map((paragraph, index) => {
          const visuals = inlineVisuals[index] ?? [];
          return (
            <div className="lesson-segment" key={`${lesson.id}-paragraph-${index}`}>
              <p>{paragraph}</p>
              {visuals.map((visual) => (
                <VisualExplainer key={`${lesson.id}-${index}-${visual}`} kind={visual} />
              ))}
            </div>
          );
        })}
      </div>
      <div className="teacher-note">
        <strong>Bu dersten sonra şunu bilmelisin:</strong>
        <span>{lesson.mustKnow[0]}</span>
      </div>
    </section>
  );
}

function WorkedExample({ script }: { script?: { paragraphs: string[]; exampleTitle: string; exampleSteps: string[] } }) {
  return (
    <section className="worked-example">
      <div className="section-title">
        <Sparkles size={22} />
        <div>
          <h2>{script?.exampleTitle ?? "Örnek çözüm"}</h2>
          <p>Burada sen cevaplamadan önce beraber çözüyoruz.</p>
        </div>
      </div>
      <ol>
        {(script?.exampleSteps ?? ["Soruyu küçük parçalara ayır.", "Verilenleri yaz.", "Adım adım sonucu takip et."]).map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </section>
  );
}

function NarrativeBlock({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <section className="narrative-block">
      <h2>
        {icon}
        {title}
      </h2>
      <p>{body}</p>
    </section>
  );
}

function InlineCheckpoint({
  title,
  question,
  selected,
  mode,
  onAnswer,
  onMode,
}: {
  title: string;
  question: PracticeQuestion;
  selected?: string;
  mode: "short" | "simple" | "exam";
  onAnswer: (option: string) => void;
  onMode: (mode: "short" | "simple" | "exam") => void;
}) {
  return (
    <section className="checkpoint">
      <div className="checkpoint-heading">
        <HelpCircle size={18} />
        <strong>{title}</strong>
      </div>
      <QuestionCard index={1} question={question} selected={selected} mode={mode} onAnswer={onAnswer} onMode={onMode} compact />
    </section>
  );
}

function QuestionCard({
  question,
  index,
  selected,
  mode,
  onAnswer,
  onMode,
  compact = false,
}: {
  question: PracticeQuestion;
  index: number;
  selected?: string;
  mode: "short" | "simple" | "exam";
  onAnswer: (option: string) => void;
  onMode: (mode: "short" | "simple" | "exam") => void;
  compact?: boolean;
}) {
  const answered = Boolean(selected);
  const correct = selected === question.answer;
  const explanation =
    mode === "simple" ? question.simpleExplanation : mode === "exam" ? question.examThinking : question.shortExplanation;

  return (
    <article className={compact ? "question-card compact" : "question-card"}>
      <div className="question-meta">
        <span>Soru {index}</span>
        <span>{question.level}</span>
      </div>
      <h3>{question.prompt}</h3>
      {question.code ? <pre>{question.code}</pre> : null}
      <div className="options">
        {question.options.map((option) => {
          const isSelected = selected === option;
          const isAnswer = question.answer === option;
          return (
            <button
              className={answered && isAnswer ? "option correct" : answered && isSelected ? "option wrong" : "option"}
              key={option}
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
      {answered ? (
        <div className={correct ? "feedback correct" : "feedback wrong"}>
          <strong>{correct ? "Doğru" : `Yanlış. Doğru cevap: ${question.answer}`}</strong>
          <div className="explain-tabs">
            <button className={mode === "short" ? "active" : ""} onClick={() => onMode("short")}>
              Kısa açıklama
            </button>
            <button className={mode === "simple" ? "active" : ""} onClick={() => onMode("simple")}>
              Çocuk gibi anlat
            </button>
            <button className={mode === "exam" ? "active" : ""} onClick={() => onMode("exam")}>
              Sınavda nasıl düşünürüm?
            </button>
          </div>
          <p>{explanation}</p>
        </div>
      ) : null}
    </article>
  );
}

function ExamMode({
  questions,
  selectedAnswers,
  explanationMode,
  progress,
  answerQuestion,
  setExplanationMode,
  weakTopics,
  examVersion,
  setExamVersion,
}: {
  questions: PracticeQuestion[];
  selectedAnswers: Record<string, string>;
  explanationMode: Record<string, "short" | "simple" | "exam">;
  progress: ProgressState;
  answerQuestion: (question: PracticeQuestion, option: string) => void;
  setExplanationMode: React.Dispatch<React.SetStateAction<Record<string, "short" | "simple" | "exam">>>;
  weakTopics: Array<[string, number]>;
  examVersion: number;
  setExamVersion: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <article className="lesson-reader">
      <div className="lesson-hero">
        <span>Deneme</span>
        <h1>20 Soruluk Final Denemesi</h1>
        <p>Karışık test. Yanlışlar otomatik yanlış defterine gider; zayıf konular aşağıda görünür.</p>
      </div>
      <section className="learning-card">
        <div className="exam-toolbar">
          <strong>Deneme seti {examVersion + 1}/5</strong>
          <button className="ghost-action" onClick={() => setExamVersion((current) => (current + 1) % 5)}>
            <RotateCcw size={16} /> Yeni deneme getir
          </button>
        </div>
        <div className="exam-summary">
          <div>
            <strong>{progress.lastExamScore ?? 0}/20</strong>
            <span>son deneme doğru</span>
          </div>
          <div>
            <strong>{progress.wrong.length}</strong>
            <span>tekrar sorusu</span>
          </div>
          <div>
            <strong>{weakTopics[0]?.[0] ?? "Veri yok"}</strong>
            <span>en zayıf konu</span>
          </div>
        </div>
        <div className="question-stack">
          {questions.map((question, index) => (
            <QuestionCard
              key={`exam-${question.id}`}
              index={index + 1}
              question={question}
              selected={selectedAnswers[question.id]}
              mode={explanationMode[question.id] ?? "short"}
              onAnswer={(option) => answerQuestion(question, option)}
              onMode={(mode) => setExplanationMode((current) => ({ ...current, [question.id]: mode }))}
            />
          ))}
        </div>
      </section>
    </article>
  );
}

function HelpPanel({
  chatMessages,
  chatInput,
  chatLoading,
  setChatInput,
  sendChat,
  wrongQuestions,
}: {
  chatMessages: ChatMessage[];
  chatInput: string;
  chatLoading: boolean;
  setChatInput: (value: string) => void;
  sendChat: () => void;
  wrongQuestions: PracticeQuestion[];
}) {
  return (
    <aside className="help-panel">
      <div className="section-title">
        <MessageCircle size={20} />
        <div>
          <h2>Anlamadım paneli</h2>
          <p>Ana dersi bölmeden yardım al.</p>
        </div>
      </div>
      <div className="chat-log">
        {chatMessages.map((message, index) => (
          <div className={message.role === "user" ? "chat user" : "chat assistant"} key={`${message.role}-${index}`}>
            {message.content}
          </div>
        ))}
        {chatLoading ? <div className="chat assistant">Daha basit bir örnek hazırlıyorum...</div> : null}
      </div>
      <div className="chat-input">
        <input
          value={chatInput}
          onChange={(event) => setChatInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendChat();
          }}
          placeholder="Bunu hiç anlamadım..."
        />
        <button onClick={sendChat}>Sor</button>
      </div>
      <div className="wrong-strip">
        <strong>Yanlış defteri</strong>
        {wrongQuestions.length === 0 ? (
          <p>Henüz yanlış yok.</p>
        ) : (
          wrongQuestions.slice(0, 4).map((question) => (
            <span key={question.id}>
              <XCircle size={14} /> {question.topic}
            </span>
          ))
        )}
      </div>
    </aside>
  );
}

type VisualItem = {
  label: string;
  sub?: string;
  state?: "active" | "found" | "muted" | "swap" | "new" | "warning";
};

type VisualFrame = {
  title: string;
  caption: string;
  cells?: VisualItem[];
  bars?: VisualItem[];
  stack?: VisualItem[];
  queue?: VisualItem[];
  buckets?: VisualItem[];
  nodes?: VisualItem[];
};

const animationFrames: Record<string, VisualFrame[]> = {
  code: [
    {
      title: "Dizi rafını çiz",
      caption: "`int[] dizi = {2, 3, 4};` tek kutu değil, yan yana üç kutudur.",
      cells: [
        { label: "2", sub: "indis 0", state: "active" },
        { label: "3", sub: "indis 1" },
        { label: "4", sub: "indis 2" },
      ],
    },
    {
      title: "`dizi[1]` ikinci kutuya gider",
      caption: "Köşeli parantezin içi değer değil, adres gibi düşün: 1 numaralı göze git.",
      cells: [
        { label: "2", sub: "indis 0", state: "muted" },
        { label: "3", sub: "indis 1", state: "found" },
        { label: "4", sub: "indis 2", state: "muted" },
      ],
    },
    {
      title: "`Length` eleman sayısını verir",
      caption: "Son indis 2 olsa bile eleman sayısı 3'tür. Bu iki bilgiyi karıştırma.",
      cells: [
        { label: "2", sub: "1. eleman" },
        { label: "3", sub: "2. eleman" },
        { label: "4", sub: "3. eleman" },
      ],
    },
  ],
  growth: [
    {
      title: "O(1): iş sabit",
      caption: "Sadece tek kutuya bakıyorsun; sınıf büyüse de işin değişmez.",
      bars: [
        { label: "O(1)", sub: "az", state: "found" },
        { label: "O(n)", sub: "orta", state: "muted" },
        { label: "O(n²)", sub: "çok", state: "muted" },
      ],
    },
    {
      title: "O(n): tek tek gezer",
      caption: "Sınıf yoklaması gibi; kişi sayısı artarsa kontrol sayısı da artar.",
      bars: [
        { label: "O(1)", sub: "az", state: "muted" },
        { label: "O(n)", sub: "orta", state: "active" },
        { label: "O(n²)", sub: "çok", state: "muted" },
      ],
    },
    {
      title: "O(n²): iç içe döngü alarmı",
      caption: "Herkesin herkesle eşleşmesi gibi; sınavda `for` içinde `for` görünce bunu düşün.",
      bars: [
        { label: "O(1)", sub: "az", state: "muted" },
        { label: "O(n)", sub: "orta", state: "muted" },
        { label: "O(n²)", sub: "çok", state: "warning" },
      ],
    },
  ],
  search: [
    {
      title: "Hedef: 10 sayısını bul",
      caption: "Önce hedefi netleştir: Bu sıralı dizide 10'u arıyoruz. Binary search ilk olarak ortaya bakacak.",
      cells: [
        { label: "2" },
        { label: "4" },
        { label: "6", state: "active" },
        { label: "8" },
        { label: "10" },
      ],
    },
    {
      title: "10 büyük, sol taraf gider",
      caption: "10, 6'dan büyük olduğu için 2 ve 4 artık düşünülmez.",
      cells: [
        { label: "2", state: "muted" },
        { label: "4", state: "muted" },
        { label: "6", state: "muted" },
        { label: "8", state: "active" },
        { label: "10", state: "active" },
      ],
    },
    {
      title: "Değer bulundu",
      caption: "Her adımda alan yarıya indiği için binary search O(log n)'dir.",
      cells: [
        { label: "2", state: "muted" },
        { label: "4", state: "muted" },
        { label: "6", state: "muted" },
        { label: "8", state: "muted" },
        { label: "10", state: "found" },
      ],
    },
  ],
  "linear-search": [
    {
      title: "Hedef: 7 sayısını bul",
      caption: "Önce hedefi netleştir: Bu karışık dizide 7'yi arıyoruz. Sıralı olmadığı için soldan tek tek bakacağız.",
      cells: [
        { label: "5", state: "active" },
        { label: "9" },
        { label: "2" },
        { label: "7" },
      ],
    },
    {
      title: "Bulamadıysa sıradakine geç",
      caption: "5 aranan değer değil. İkinci kontrol 9'dur; o da 7 değildir.",
      cells: [
        { label: "5", state: "muted" },
        { label: "9", state: "active" },
        { label: "2" },
        { label: "7" },
      ],
    },
    {
      title: "Kontrol devam eder",
      caption: "Üçüncü kontrol 2. Hâlâ bulamadık; sıradaki elemana geçiyoruz.",
      cells: [
        { label: "5", state: "muted" },
        { label: "9", state: "muted" },
        { label: "2", state: "active" },
        { label: "7" },
      ],
    },
    {
      title: "Dördüncü kontrolde bulundu",
      caption: "7 bulundu. Bu örnekte linear search 4 kontrol yaptı.",
      cells: [
        { label: "5", state: "muted" },
        { label: "9", state: "muted" },
        { label: "2", state: "muted" },
        { label: "7", state: "found" },
      ],
    },
  ],
  sorting: [
    {
      title: "Selection Sort: en küçüğü ara",
      caption: "Dizi `[5, 1, 8, 3]`. İlk turda bütün dizi içinde minimum aranır.",
      bars: [
        { label: "5", state: "active" },
        { label: "1", state: "found" },
        { label: "8" },
        { label: "3" },
      ],
    },
    {
      title: "Minimum başa gelir",
      caption: "1 ile ilk eleman 5 yer değiştirir. İlk kutu artık kesinleşti.",
      bars: [
        { label: "1", state: "found" },
        { label: "5", state: "swap" },
        { label: "8" },
        { label: "3" },
      ],
    },
    {
      title: "Sıradaki bölümde tekrar ara",
      caption: "Selection Sort her tur kalan bölümün en küçüğünü seçer.",
      bars: [
        { label: "1", state: "muted" },
        { label: "5", state: "active" },
        { label: "8" },
        { label: "3", state: "found" },
      ],
    },
  ],
  "search-choice": [
    {
      title: "Önce dizi sıralı mı diye bak",
      caption: "Karışık dizide binary search kullanamazsın. Çünkü ortadan bakınca yön seçemezsin.",
      cells: [
        { label: "5" },
        { label: "1", state: "warning" },
        { label: "9" },
        { label: "2", state: "warning" },
      ],
    },
    {
      title: "Karışık dizi: linear search",
      caption: "Düzen yoksa güvenli yol tek tek bakmaktır. Bu O(n)'dir.",
      cells: [
        { label: "Linear", sub: "çalışır", state: "found" },
        { label: "Binary", sub: "çalışmaz", state: "muted" },
      ],
    },
    {
      title: "Sıralı dizi: binary search mümkün",
      caption: "Sıralı dizide ortadan bakıp sağ/sol tarafı eleyebilirsin.",
      cells: [
        { label: "2" },
        { label: "4" },
        { label: "6", state: "active" },
        { label: "8" },
        { label: "10" },
      ],
    },
  ],
  "bubble-pass": [
    {
      title: "Bubble Sort komşuları karşılaştırır",
      caption: "`[3, 2, 1]` için önce 3 ve 2 karşılaştırılır; büyük olan sağa geçer.",
      cells: [
        { label: "3", state: "active" },
        { label: "2", state: "active" },
        { label: "1" },
      ],
    },
    {
      title: "İlk yer değişimi",
      caption: "3, 2'den büyük olduğu için yer değiştirir: `[2, 3, 1]`.",
      cells: [
        { label: "2", state: "swap" },
        { label: "3", state: "swap" },
        { label: "1" },
      ],
    },
    {
      title: "3 ve 1 karşılaştırılır",
      caption: "3, 1'den büyük; tekrar yer değiştirir. İlk tur sonunda en büyük sona gider.",
      cells: [
        { label: "2" },
        { label: "1", state: "swap" },
        { label: "3", state: "found" },
      ],
    },
  ],
  "counting-sort": [
    {
      title: "Counting Sort önce sayar",
      caption: "Dizi `[2, 0, 2, 1]`. Her değerden kaç tane var, onu sayacağız.",
      cells: [
        { label: "2", state: "active" },
        { label: "0" },
        { label: "2", state: "active" },
        { label: "1" },
      ],
    },
    {
      title: "Frekans dizisi oluşur",
      caption: "0 bir kez, 1 bir kez, 2 iki kez geçti.",
      buckets: [
        { label: "0", sub: "1 tane" },
        { label: "1", sub: "1 tane" },
        { label: "2", sub: "2 tane", state: "found" },
      ],
    },
    {
      title: "Sayılara göre geri yazılır",
      caption: "Önce bir tane 0, sonra bir tane 1, sonra iki tane 2 yazılır: `[0, 1, 2, 2]`.",
      cells: [
        { label: "0", state: "found" },
        { label: "1", state: "found" },
        { label: "2", state: "found" },
        { label: "2", state: "found" },
      ],
    },
  ],
  hash: [
    {
      title: "12 için kova hesapla",
      caption: "Tablo boyutu 10: `12 % 10 = 2`. 12, 2 numaralı kovaya gider.",
      buckets: [
        { label: "0" },
        { label: "1" },
        { label: "2: 12", state: "found" },
        { label: "3" },
      ],
    },
    {
      title: "22 de aynı kovaya düşer",
      caption: "`22 % 10 = 2`. İki farklı değer aynı kovayı istedi: çarpışma.",
      buckets: [
        { label: "0" },
        { label: "1" },
        { label: "2: 12 + 22", state: "warning" },
        { label: "3" },
      ],
    },
    {
      title: "Çözüm yöntemini seç",
      caption: "Zincirleme aynı kovada liste tutar; linear probing sıradaki boş kovayı arar.",
      buckets: [
        { label: "Zincirleme", sub: "liste" },
        { label: "Linear", sub: "+1 ara", state: "active" },
        { label: "Quadratic", sub: "+1²,+2²" },
        { label: "Double", sub: "2. hash" },
      ],
    },
  ],
  "linear-probing": [
    {
      title: "Linear probing çarpışmada yana kayar",
      caption: "Tablo boyutu 5. `7 % 5 = 2`, 7 önce 2 numaralı kovaya yerleşir.",
      buckets: [
        { label: "0" },
        { label: "1" },
        { label: "2: 7", state: "found" },
        { label: "3" },
        { label: "4" },
      ],
    },
    {
      title: "12 de 2 numaralı kovayı ister",
      caption: "`12 % 5 = 2`. Kova dolu olduğu için çarpışma oldu.",
      buckets: [
        { label: "0" },
        { label: "1" },
        { label: "2: 7", state: "warning" },
        { label: "3" },
        { label: "4" },
      ],
    },
    {
      title: "Bir sonraki boş kovaya yerleşir",
      caption: "Linear probing +1 ilerler. 3 boşsa 12 oraya yerleşir.",
      buckets: [
        { label: "0" },
        { label: "1" },
        { label: "2: 7" },
        { label: "3: 12", state: "found" },
        { label: "4" },
      ],
    },
  ],
  stack: [
    {
      title: "Push üstüne koyar",
      caption: "5 geldi, sonra 2 geldi, sonra 8 geldi. En üstte 8 var.",
      stack: [
        { label: "8", state: "active" },
        { label: "2" },
        { label: "5" },
      ],
    },
    {
      title: "Pop en üsttekini çıkarır",
      caption: "`Pop()` 8'i çıkarır. Stack'te artık tepe 2 olur.",
      stack: [
        { label: "2", state: "found" },
        { label: "5" },
      ],
    },
    {
      title: "Peek sadece bakar",
      caption: "`Peek()` 2'yi gösterir ama 2'yi silmez.",
      stack: [
        { label: "2", state: "found" },
        { label: "5" },
      ],
    },
  ],
  queue: [
    {
      title: "Hedef: kuyrukta ne kalır?",
      caption: "İşlemler: Enqueue(5), Enqueue(2), Enqueue(8), Dequeue(), Peek(). Önce boş kuyruğu düşün.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "boş", state: "warning" },
        { label: "Arka", state: "muted" },
      ],
    },
    {
      title: "Enqueue(5): 5 arkaya girer",
      caption: "Kuyruk boş olduğu için 5 hem öndeki hem arkadaki elemandır.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "5", state: "active" },
        { label: "Arka", state: "muted" },
      ],
    },
    {
      title: "Enqueue(2): 2 en arkaya eklenir",
      caption: "5 daha önce geldiği için önde kalır. 2 onun arkasına geçer.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "5", state: "found" },
        { label: "2" },
        { label: "Arka", state: "muted" },
      ],
    },
    {
      title: "Enqueue(8): 8 en arkaya eklenir",
      caption: "Yeni gelen kimse sıranın sonuna geçer. Kuyruk artık 5, 2, 8.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "5", state: "found" },
        { label: "2" },
        { label: "8", state: "new" },
        { label: "Arka", state: "muted" },
      ],
    },
    {
      title: "Dequeue önden çıkarır",
      caption: "Dequeue arkadaki 8'i değil, öndeki 5'i çıkarır. Çünkü ilk giren ilk çıkar.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "2", state: "found" },
        { label: "8" },
        { label: "Arka", state: "muted" },
      ],
    },
    {
      title: "Peek öne bakar ama silmez",
      caption: "Peek sonucu 2'dir. Ama 2 kuyruktan çıkmaz; sadece öndeki eleman okunur.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "2", state: "found" },
        { label: "8", state: "new" },
        { label: "Arka", state: "muted" },
      ],
    },
    {
      title: "Son durum: kuyrukta 2 ve 8 kalır",
      caption: "İşlem sonucu sorulursa cevabı soldan sağa yaz: 2, 8. Öndeki 2, arkadaki 8.",
      queue: [
        { label: "Ön", state: "muted" },
        { label: "2", state: "found" },
        { label: "8", state: "found" },
        { label: "Arka", state: "muted" },
      ],
    },
  ],
  "queue-array": [
    {
      title: "Diziyle kuyruk kurarsan front/rear tutarsın",
      caption: "Dizide kutular var. `front` öndeki elemanı, `rear` son eklenen elemanı gösterir.",
      cells: [
        { label: "5", sub: "front" },
        { label: "2" },
        { label: "8", sub: "rear" },
        { label: "boş", state: "muted" },
      ],
    },
    {
      title: "Dequeue olunca front ilerler",
      caption: "5 çıktıktan sonra elemanları kaydırmak yerine front göstergesini 2'ye ilerletebilirsin.",
      cells: [
        { label: "5", sub: "çıktı", state: "muted" },
        { label: "2", sub: "front", state: "found" },
        { label: "8", sub: "rear" },
        { label: "boş", state: "muted" },
      ],
    },
    {
      title: "Enqueue yeni değeri rear tarafına ekler",
      caption: "9 gelirse arka tarafa eklenir ve rear 9'u gösterir.",
      cells: [
        { label: "5", sub: "boş", state: "muted" },
        { label: "2", sub: "front", state: "found" },
        { label: "8" },
        { label: "9", sub: "rear", state: "new" },
      ],
    },
  ],
  linked: [
    {
      title: "Linked list bağlantıyla ilerler",
      caption: "Head ilk düğümü gösterir; her düğüm bir sonrakinin adresini tutar.",
      nodes: [
        { label: "Head", state: "found" },
        { label: "A" },
        { label: "C" },
        { label: "Tail" },
      ],
    },
    {
      title: "Araya B eklenecek",
      caption: "Dizi gibi herkesi kaydırmak yok; bağlantılar değişecek.",
      nodes: [
        { label: "Head" },
        { label: "A", state: "active" },
        { label: "B", state: "new" },
        { label: "C", state: "active" },
      ],
    },
    {
      title: "Bağlantılar güncellendi",
      caption: "A artık B'yi, B de C'yi gösterir: A -> B -> C.",
      nodes: [
        { label: "Head" },
        { label: "A" },
        { label: "B", state: "found" },
        { label: "C" },
      ],
    },
  ],
  "linked-cost": [
    {
      title: "Dizide indeksle direkt gidersin",
      caption: "`dizi[2]` üçüncü kutuya doğrudan gider. Bu yüzden erişim O(1)'dir.",
      cells: [
        { label: "A", sub: "0" },
        { label: "B", sub: "1" },
        { label: "C", sub: "2", state: "found" },
      ],
    },
    {
      title: "Linked listte baştan yürürsün",
      caption: "Üçüncü düğüme gitmek için Head -> A -> B -> C şeklinde bağlantı takip edilir.",
      nodes: [
        { label: "Head", state: "active" },
        { label: "A" },
        { label: "B" },
        { label: "C", state: "found" },
      ],
    },
    {
      title: "Bu yüzden arama O(n)",
      caption: "Kaçıncı düğüm olduğunu bilsen bile bağlantıları sırayla geçmen gerekir.",
      nodes: [
        { label: "1. adım" },
        { label: "2. adım" },
        { label: "3. adım", state: "found" },
      ],
    },
  ],
  circular: [
    {
      title: "Normal listede son boşu gösterir",
      caption: "Son düğümden sonra liste biter.",
      nodes: [
        { label: "A" },
        { label: "B" },
        { label: "C", state: "active" },
        { label: "null", state: "muted" },
      ],
    },
    {
      title: "Dairesel listede son başa bağlanır",
      caption: "C'nin `next` değeri tekrar A'yı gösterir.",
      nodes: [
        { label: "A", state: "found" },
        { label: "B" },
        { label: "C", state: "active" },
        { label: "A'ya dön", state: "new" },
      ],
    },
    {
      title: "Çift yönlüde geri bağlantı da var",
      caption: "next ileri, prev geri gider. Avantaj: iki yön. Dezavantaj: ekstra bellek.",
      nodes: [
        { label: "prev" },
        { label: "Düğüm", state: "found" },
        { label: "next" },
      ],
    },
  ],
  string: [
    {
      title: "String karakter dizisi gibi okunur",
      caption: "`abcd` içinde `txt[2]` üçüncü karaktere gider.",
      cells: [
        { label: "a", sub: "0" },
        { label: "b", sub: "1" },
        { label: "c", sub: "2", state: "found" },
        { label: "d", sub: "3" },
      ],
    },
    {
      title: "ToUpper harfleri büyütür",
      caption: "`umut`.ToUpper() sonucu `UMUT` olur.",
      cells: [
        { label: "u -> U", state: "active" },
        { label: "m -> M", state: "active" },
        { label: "u -> U", state: "active" },
        { label: "t -> T", state: "active" },
      ],
    },
    {
      title: "Split metni parçalar",
      caption: "`ali veli` boşluktan bölünür: `ali` ve `veli`.",
      cells: [
        { label: "ali", state: "found" },
        { label: "boşluk", state: "muted" },
        { label: "veli", state: "found" },
      ],
    },
  ],
  tree: [
    {
      title: "Kökten başla",
      caption: "BST'de ilk bakılan düğüm köktür. Kök 8 olsun.",
      nodes: [{ label: "8", state: "found" }],
    },
    {
      title: "Küçükler sola gider",
      caption: "3, 8'den küçük olduğu için sol çocuğa yerleşir.",
      nodes: [
        { label: "3", state: "active" },
        { label: "8", state: "found" },
      ],
    },
    {
      title: "Büyükler sağa gider",
      caption: "10, 8'den büyük olduğu için sağ çocuğa yerleşir.",
      nodes: [
        { label: "3" },
        { label: "8", state: "found" },
        { label: "10", state: "active" },
      ],
    },
  ],
};

function VisualExplainer({ kind }: { kind: string }) {
  const frames = animationFrames[kind] ?? animationFrames.code;
  const [step, setStep] = useState(0);
  const frame = frames[step] ?? frames[0];

  function renderItems(items: VisualItem[] | undefined, className: string) {
    if (!items) return null;
    return (
      <div className={className}>
        {items.map((item, index) => (
          <span className={item.state ? `anim-item ${item.state}` : "anim-item"} key={`${item.label}-${index}`}>
            <strong>{item.label}</strong>
            {item.sub ? <small>{item.sub}</small> : null}
          </span>
        ))}
      </div>
    );
  }

  return (
    <section className="visual animated-visual">
      <div className="anim-copy">
        <span>Adım {step + 1}/{frames.length}</span>
        <h2>{frame.title}</h2>
        <p>{frame.caption}</p>
      </div>
      <div className="anim-stage">
        {renderItems(frame.cells, "anim-row")}
        {renderItems(frame.bars, "anim-bars")}
        {renderItems(frame.stack, "anim-stack")}
        {renderItems(frame.queue, "anim-row")}
        {renderItems(frame.buckets, "anim-buckets")}
        {renderItems(frame.nodes, "anim-nodes")}
      </div>
      <div className="anim-controls">
        <button className="ghost-action" onClick={() => setStep(0)}>
          <RotateCcw size={16} /> Başa sar
        </button>
        <div className="anim-dots" aria-label="Animasyon adımları">
          {frames.map((item, index) => (
            <button
              className={index === step ? "active" : ""}
              key={item.title}
              onClick={() => setStep(index)}
              aria-label={`${index + 1}. adıma git`}
            />
          ))}
        </div>
        <button className="primary-action" onClick={() => setStep((current) => (current + 1) % frames.length)}>
          Oynat <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}

function CramPanel() {
  return (
    <article className="lesson-reader">
      <div className="lesson-hero">
        <span>Son tekrar</span>
        <h1>Son Saat Ezberi</h1>
        <p>Sınava girmeden önce sadece bunları hızlıca oku.</p>
      </div>
      <section className="learning-card">
        <div className="cram-list">
          {cramRules.map((rule, index) => (
            <div key={rule}>
              <span>{index + 1}</span>
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
