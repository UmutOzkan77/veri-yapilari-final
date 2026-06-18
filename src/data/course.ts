export type QuestionLevel = "kolay" | "orta" | "sinav";

export type PracticeQuestion = {
  id: string;
  topic: string;
  level: QuestionLevel;
  prompt: string;
  code?: string;
  options: string[];
  answer: string;
  shortExplanation: string;
  simpleExplanation: string;
  examThinking: string;
};

export type Lesson = {
  id: string;
  title: string;
  shortTitle: string;
  minutes: number;
  examWeight: number;
  visual: "code" | "growth" | "search" | "stack" | "queue" | "sorting" | "hash" | "linked" | "circular" | "string" | "tree";
  hook: string;
  concept: string;
  analogy: string;
  examPattern: string;
  codeReading: string;
  mustKnow: string[];
  practice: PracticeQuestion[];
};

const lessonCatalog: Lesson[] = [
  {
    id: "csharp",
    title: "C# Hayatta Kalma Kiti",
    shortTitle: "C# Temel",
    minutes: 75,
    examWeight: 7,
    visual: "code",
    hook: "Sınavda C# yazman gerekirse bile önce kodu okuyabilmen gerekir.",
    concept:
      "C# kodunda değişken bir kutu, dizi yan yana kutular, for döngüsü tekrar makinesi, if karar noktası, fonksiyon ise işi paketleyen küçük makinedir. Finalde genelde uzun program yazdırmaktan çok kod parçasının ne yaptığını anlaman beklenir.",
    analogy:
      "Bir tostçu düşün: sipariş fişi değişken, tostların dizildiği raf dizi, her tostun üstünden tek tek geçmek for döngüsü, peynir var mı diye bakmak if, tost hazırlama tarifi de fonksiyondur.",
    examPattern:
      "Hocanın tarzında `for` döngüsü kaç kere döner, `return` ne döndürür, `Console.WriteLine` ne basar gibi kısa kod okuma soruları gelir.",
    codeReading:
      "`int[] dizi` görürsen bir sayı dizisi var. `dizi[i]` i'nci kutu demektir. `for (int i = 0; i < dizi.Length; i++)` diziyi baştan sona gezer. `return` fonksiyondan sonucu geri verir.",
    mustKnow: ["Dizi indisi 0'dan başlar.", "`Length` eleman sayısını verir.", "`void` değer döndürmeyen fonksiyondur.", "`return` fonksiyonu bitirir."],
    practice: [
      {
        id: "csharp-1",
        topic: "C# Temel",
        level: "kolay",
        prompt: "`int[] nums = {2, 3, 4};` dizisinde `nums[1]` kaçtır?",
        options: ["2", "3", "4", "1"],
        answer: "3",
        shortExplanation: "Dizi indisleri 0'dan başlar: nums[0]=2, nums[1]=3.",
        simpleExplanation: "Rafın ilk gözü 0 numara. İkinci göze 1 diyoruz. İkinci gözde 3 var.",
        examThinking: "İndis sorularında önce 0'dan saymaya başla; öğrencilerin en sık hatası 1'den saymaktır.",
      },
      {
        id: "csharp-2",
        topic: "C# Temel",
        level: "orta",
        prompt: "Bu döngü ekrana kaç sayı yazar?",
        code: "for (int i = 0; i < 4; i++)\n{\n    Console.Write(i);\n}",
        options: ["3", "4", "5", "Sonsuz"],
        answer: "4",
        shortExplanation: "i değerleri 0, 1, 2, 3 olur. 4 olunca koşul false olur.",
        simpleExplanation: "0'dan başlıyor, 4'e gelmeden duruyor. Bu yüzden 0-1-2-3: toplam 4 yazma.",
        examThinking: "`i < 4` varsa 4 dahil değildir. Sınavda hızlıca değerleri yan yana yaz.",
      },
      {
        id: "csharp-3",
        topic: "Fonksiyon",
        level: "sinav",
        prompt: "Aşağıdaki fonksiyon ne döndürür?",
        code: "public static int kare(int x)\n{\n    return x * x;\n}\n\nConsole.WriteLine(kare(5));",
        options: ["10", "20", "25", "Hata"],
        answer: "25",
        shortExplanation: "Fonksiyon 5 * 5 işlemini döndürür.",
        simpleExplanation: "Makineye 5 veriyorsun, makine onu kendisiyle çarpıp 25 çıkarıyor.",
        examThinking: "Fonksiyon sorusunda parametreyi yerine koy: x yerine 5 yaz, işlemi yap.",
      },
    ],
  },
  {
    id: "big-o",
    title: "Çalışma Zamanı ve Big O",
    shortTitle: "Big O",
    minutes: 60,
    examWeight: 10,
    visual: "growth",
    hook: "Soru büyüyünce programın ne kadar yorulacağını Big O söyler.",
    concept:
      "Big O, kodun kesin kaç saniye süreceğini değil, veri sayısı artınca iş yükünün nasıl büyüdüğünü anlatır. Tek işlem O(1), tek döngü O(n), iki iç içe döngü O(n²), her adımda yarıya bölme O(log n), iyi sıralamalar çoğunlukla O(n log n) olarak düşünülür.",
    analogy:
      "Sınıfta bir kişiyi yoklamak O(1), bütün sınıfı tek tek yoklamak O(n), herkesin herkesle tokalaşması O(n²), telefon rehberini ortadan ikiye bölerek aramak O(log n) gibidir.",
    examPattern:
      "Vizede olduğu gibi `Quick Sort en kötü durumda nedir?`, `uzay karmaşıklığı nasıl ölçülür?`, `binary search neden hızlıdır?` tarzı test soruları gelir.",
    codeReading:
      "Bir `for` varsa genelde O(n). Bir for içinde bir for daha varsa genelde O(n²). Döngüde `i *= 2` veya aralık yarıya iniyorsa O(log n).",
    mustKnow: ["Linear search O(n).", "Binary search O(log n) ama dizi sıralı olmalı.", "Bubble/Selection/Insertion ortalama O(n²).", "Quick Sort ortalama O(n log n), en kötü O(n²)."],
    practice: [
      {
        id: "big-o-1",
        topic: "Big O",
        level: "kolay",
        prompt: "Bir dizinin tüm elemanlarını baştan sona gezen tek döngünün karmaşıklığı nedir?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        answer: "O(n)",
        shortExplanation: "Eleman sayısı artarsa döngü de aynı oranda artar.",
        simpleExplanation: "10 öğrenci varsa 10 kişiye bakarsın, 100 öğrenci varsa 100 kişiye. Bu O(n).",
        examThinking: "Tek döngü gördüğünde ilk adayın O(n) olsun.",
      },
      {
        id: "big-o-2",
        topic: "Big O",
        level: "orta",
        prompt: "İç içe iki döngü genelde hangi karmaşıklığa sahiptir?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        answer: "O(n²)",
        shortExplanation: "Dış döngünün her adımı için iç döngü tekrar çalışır.",
        simpleExplanation: "Herkesin herkesle tokalaşması gibi: kişi artınca iş çok daha hızlı büyür.",
        examThinking: "`for` içinde `for` görünce O(n²) seçeneğini ciddi düşün.",
      },
      {
        id: "big-o-3",
        topic: "Quick Sort",
        level: "sinav",
        prompt: "Quick Sort algoritmasının en kötü durum zaman karmaşıklığı nedir?",
        options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
        answer: "O(n²)",
        shortExplanation: "Pivot seçimleri çok kötü olursa bölme dengeli olmaz ve O(n²) olur.",
        simpleExplanation: "Hep yanlış kişiyi lider seçersen ekip ikiye güzel bölünmez; iş uzar.",
        examThinking: "Quick Sort için iki bilgiyi ayır: ortalama O(n log n), en kötü O(n²).",
      },
    ],
  },
  {
    id: "stack",
    title: "Yığınlar: LIFO Mantığı",
    shortTitle: "Stack",
    minutes: 55,
    examWeight: 10,
    visual: "stack",
    hook: "Stack, son girenin ilk çıktığı veri yapısıdır.",
    concept:
      "Stack'te ekleme ve çıkarma aynı uçtan yapılır. `Push` ekler, `Pop` en üsttekini çıkarır, `Peek` en üsttekine sadece bakar. Mantığın adı LIFO: Last In First Out.",
    analogy:
      "Tabak yığını düşün. En son koyduğun tabak en üsttedir ve ilk onu alırsın. Alttaki tabağı almak için önce üsttekileri kaldırman gerekir.",
    examPattern:
      "Sınavda `Push(13), Push(4), Pop(), Peek()` gibi işlem dizisi verilip ekrana ne yazdığı ya da yığında ne kaldığı sorulur.",
    codeReading:
      "`Stack<int> yigin = new Stack<int>();` görürsen en üst elemanı takip et. `Pop()` çıkarır, `Peek()` çıkarmaz.",
    mustKnow: ["Stack = LIFO.", "`Push` ekler.", "`Pop` çıkarır ve döndürür.", "`Peek` sadece bakar."],
    practice: [
      {
        id: "stack-1",
        topic: "Stack",
        level: "kolay",
        prompt: "Stack için doğru ifade hangisidir?",
        options: ["İlk giren ilk çıkar", "Son giren ilk çıkar", "Ortadan çıkarır", "Her zaman sıralar"],
        answer: "Son giren ilk çıkar",
        shortExplanation: "Stack LIFO mantığıyla çalışır.",
        simpleExplanation: "Üste en son koyduğun tabağı ilk alırsın.",
        examThinking: "Stack kelimesini görür görmez aklına LIFO gelsin.",
      },
      {
        id: "stack-2",
        topic: "Stack",
        level: "orta",
        prompt: "İşlemlerden sonra `Pop()` kaç döndürür?",
        code: "Push(5)\nPush(2)\nPush(8)\nPop()",
        options: ["5", "2", "8", "Boş"],
        answer: "8",
        shortExplanation: "En son eklenen 8 olduğu için ilk o çıkar.",
        simpleExplanation: "5 altta, 2 onun üstünde, 8 en üstte. Üstten alınca 8 çıkar.",
        examThinking: "Stack sorusunda her ekleneni üst üste yaz, Pop gelince en üsttekini sil.",
      },
      {
        id: "stack-3",
        topic: "Stack",
        level: "sinav",
        prompt: "Aşağıdaki kod ekrana ne yazar?",
        code: "Stack<int> y = new Stack<int>();\ny.Push(13);\ny.Push(4);\nint x = y.Pop();\nConsole.WriteLine(y.Peek());",
        options: ["13", "4", "17", "Hata"],
        answer: "13",
        shortExplanation: "`Pop()` 4'ü çıkarır. Geriye üstte 13 kalır; `Peek()` 13'e bakar.",
        simpleExplanation: "4 en üstteydi ve çıktı. Artık yığının tepesinde 13 var.",
        examThinking: "`Pop` ile `Peek` farkına dikkat et. Pop çıkarır, Peek çıkarmaz.",
      },
    ],
  },
  {
    id: "search",
    title: "Arama Algoritmaları",
    shortTitle: "Arama",
    minutes: 85,
    examWeight: 7,
    visual: "search",
    hook: "Arama sorularında önemli olan diziyi değiştirip değiştirmediğini ve kaç adımda bulduğunu anlamaktır.",
    concept:
      "Linear search diziyi baştan sona tek tek gezer. Binary search ise sıralı dizide ortadan bakar, aradığı değer küçükse sola, büyükse sağa gider. Linear search her dizide çalışır ama O(n)'dir. Binary search daha hızlıdır ama dizi sıralı olmalıdır.",
    analogy:
      "Bir sınıfta isim arıyorsan herkesin yüzüne tek tek bakmak linear search. Alfabetik sınıf listesinde ortadan açıp aradığın isim önce mi sonra mı diye yarıya indirmek binary search.",
    examPattern:
      "Hocanın vize tarzında `Doğrusal arama O(n)`, `İkili arama hangi şartta çalışır?`, `arama algoritması diziyi değiştirir mi?` gibi test soruları gelebilir.",
    codeReading:
      "`for` ile baştan sona karşılaştırma varsa linear search. `low`, `high`, `mid` veya ortadan bölme varsa binary search düşün.",
    mustKnow: ["Linear search O(n).", "Binary search O(log n).", "Binary search için dizi sıralı olmalı.", "Arama algoritmaları diziyi sıralama gibi değiştirmez."],
    practice: [
      {
        id: "search-1",
        topic: "Arama",
        level: "kolay",
        prompt: "Binary Search çalışması için en temel şart nedir?",
        options: ["Dizi sıralı olmalı", "Dizi boş olmalı", "Dizi linked list olmalı", "Değerler string olmalı"],
        answer: "Dizi sıralı olmalı",
        shortExplanation: "Binary search ortadan bölerek ilerlediği için sıralı düzene ihtiyaç duyar.",
        simpleExplanation: "Telefon rehberi alfabetik olmasa ortadan açıp isim aramak işe yaramaz.",
        examThinking: "Binary search seçeneği gördüğünde hemen `sıralı dizi` şartını ara.",
      },
      {
        id: "search-2",
        topic: "Linear Search",
        level: "orta",
        prompt: "Linear Search en kötü durumda kaç elemanı kontrol eder?",
        options: ["1", "log n", "n", "n²"],
        answer: "n",
        shortExplanation: "Aranan değer sonda olabilir veya hiç olmayabilir; bu durumda tüm elemanlar gezilir.",
        simpleExplanation: "Sınıfta aradığın kişi son sıradaysa herkese bakman gerekir.",
        examThinking: "Tek tek gezme = O(n).",
      },
      {
        id: "search-3",
        topic: "Binary Search",
        level: "sinav",
        prompt: "`[2, 4, 6, 8, 10]` dizisinde 10 aranırken binary search ilk hangi değere bakar?",
        options: ["2", "4", "6", "10"],
        answer: "6",
        shortExplanation: "Ortadaki eleman 6'dır; binary search önce ortaya bakar.",
        simpleExplanation: "Kitabı ortadan açmak gibi: önce tam ortadaki sayfaya bakarsın.",
        examThinking: "Binary search sorusunda ilk iş orta indeksi bul.",
      },
    ],
  },
  {
    id: "queue",
    title: "Kuyruklar: FIFO Mantığı",
    shortTitle: "Queue",
    minutes: 55,
    examWeight: 10,
    visual: "queue",
    hook: "Queue, ilk girenin ilk çıktığı veri yapısıdır.",
    concept:
      "Kuyrukta ekleme arkadan, çıkarma önden yapılır. `Enqueue` kuyruğa ekler, `Dequeue` ilk geleni çıkarır, `Peek` ilk geleni sadece gösterir. Mantığın adı FIFO: First In First Out.",
    analogy:
      "Market kasası gibi düşün. Sıraya ilk giren kişi kasadan ilk çıkar. Yeni gelen en arkaya geçer.",
    examPattern:
      "Final listesinde özellikle `kuyrukta şu işlemler yapıldı geriye ne kaldı` tipi soru bekleniyor.",
    codeReading:
      "`Queue<int> kuyruk` görürsen soldaki ön tarafı takip et. `Dequeue()` soldan çıkarır, `Enqueue()` sağa ekler.",
    mustKnow: ["Queue = FIFO.", "`Enqueue` arkaya ekler.", "`Dequeue` önden çıkarır.", "`Peek` öndekine bakar."],
    practice: [
      {
        id: "queue-1",
        topic: "Queue",
        level: "kolay",
        prompt: "Queue için doğru ifade hangisidir?",
        options: ["Son giren ilk çıkar", "İlk giren ilk çıkar", "En büyük çıkar", "Rastgele çıkar"],
        answer: "İlk giren ilk çıkar",
        shortExplanation: "Queue FIFO mantığıyla çalışır.",
        simpleExplanation: "Kasaya ilk gelen müşteri ilk ödeme yapar.",
        examThinking: "Queue = kuyruk = FIFO. Bu eşleştirmeyi ezberle.",
      },
      {
        id: "queue-2",
        topic: "Queue",
        level: "orta",
        prompt: "İşlemlerden sonra kuyrukta hangi elemanlar kalır?",
        code: "Enqueue(5)\nEnqueue(2)\nEnqueue(8)\nDequeue()",
        options: ["5, 2", "2, 8", "8, 5", "Sadece 5"],
        answer: "2, 8",
        shortExplanation: "İlk giren 5 çıkar; 2 ve 8 kalır.",
        simpleExplanation: "Sıranın başındaki 5 işini bitirip gider. Arkasında 2 ve 8 bekler.",
        examThinking: "Kuyruğu soldan sağa yaz. Dequeue soldan siler.",
      },
      {
        id: "queue-3",
        topic: "Queue",
        level: "sinav",
        prompt: "Aşağıdaki işlemden sonra `Peek()` kaçtır?",
        code: "Queue<int> q = new Queue<int>();\nq.Enqueue(10);\nq.Enqueue(3);\nq.Dequeue();\nq.Enqueue(7);\nConsole.WriteLine(q.Peek());",
        options: ["10", "3", "7", "Boş"],
        answer: "3",
        shortExplanation: "10 çıkarıldıktan sonra kuyruğun önü 3 olur. 7 arkaya eklenir.",
        simpleExplanation: "10 kasadan çıktı. Sıranın başına 3 geçti. 7 en arkaya geçti.",
        examThinking: "`Peek` öndekine bakar, son eklenene değil.",
      },
    ],
  },
  {
    id: "sorting",
    title: "Sıralama Algoritmaları",
    shortTitle: "Sıralama",
    minutes: 95,
    examWeight: 11,
    visual: "sorting",
    hook: "Sıralama sorularında amaç algoritmanın adımlarını elle takip edebilmektir.",
    concept:
      "Bubble yan yana elemanları karşılaştırır ve büyükleri sona taşır. Selection her tur en küçüğü bulup başa koyar. Insertion eldeki kartları uygun yere sokar. Quick pivot seçip küçükleri sola, büyükleri sağa ayırır. Counting Sort değerleri sayarak sıralar.",
    analogy:
      "Elindeki oyun kartlarını düşün. Bubble kartları yan yana değiştirir, Selection masadaki en küçüğü seçip başa alır, Insertion yeni kartı elde doğru yere sokar, Counting Sort ise kaç tane 1, 2, 3 var diye sayar.",
    examPattern:
      "`Bubble sort 1. turdan sonra dizi ne olur?`, `Insertion sort nasıl çalışır?`, `Counting sort ne zaman saçma olur?` gibi sorular beklenir.",
    codeReading:
      "İç içe döngü ve swap varsa sıralama olabilir. `min_index` görürsen Selection Sort. Yan yana `dizi[i]` ve `dizi[i+1]` karşılaştırılıyorsa Bubble Sort.",
    mustKnow: ["Bubble/Selection/Insertion O(n²).", "Quick ortalama hızlıdır.", "Counting Sort negatif olmayan ve aralığı küçük tam sayılarda mantıklı.", "Counting Sort geniş aralıkta bellek israf eder."],
    practice: [
      {
        id: "sorting-1",
        topic: "Bubble Sort",
        level: "kolay",
        prompt: "Bubble Sort ilk turda en büyük elemanı genelde nereye taşır?",
        options: ["Başa", "Ortaya", "Sona", "Rastgele yere"],
        answer: "Sona",
        shortExplanation: "Yan yana karşılaştırmalarla büyük eleman sona doğru kabarır.",
        simpleExplanation: "En büyük balon yukarı çıkar gibi, en büyük sayı sona gider.",
        examThinking: "Bubble sorusunda ilk tur sonrası en büyük değerin sonda olmasını bekle.",
      },
      {
        id: "sorting-2",
        topic: "Selection Sort",
        level: "orta",
        prompt: "Selection Sort ilk turda `[5, 1, 8, 3]` dizisini nasıl yapar?",
        options: ["[1, 5, 8, 3]", "[5, 8, 1, 3]", "[3, 1, 8, 5]", "[5, 1, 3, 8]"],
        answer: "[1, 5, 8, 3]",
        shortExplanation: "En küçük 1 bulunur ve ilk eleman 5 ile yer değiştirilir.",
        simpleExplanation: "Masadaki en küçük kartı bulup en başa koyuyorsun.",
        examThinking: "Selection ilk iş en küçüğü arar; sonra baştakiyle swap yapar.",
      },
      {
        id: "sorting-3",
        topic: "Counting Sort",
        level: "sinav",
        prompt: "Counting Sort hangi durumda kullanılması saçma olur?",
        options: ["0-5 arası çok tekrar eden sayılar", "Küçük aralıklı pozitif tam sayılar", "0 ile 1.000.000 arasında az sayıda eleman", "Not frekansı sayma"],
        answer: "0 ile 1.000.000 arasında az sayıda eleman",
        shortExplanation: "Aralık çok genişse sayma dizisi gereksiz büyük olur.",
        simpleExplanation: "3 öğrenci için 1 milyon kutuluk dolap açmak gibi; yer israfı.",
        examThinking: "Counting Sort için iki şart ara: negatif olmayan tam sayı ve küçük değer aralığı.",
      },
    ],
  },
  {
    id: "hash",
    title: "Hash Tabloları ve Çarpışma",
    shortTitle: "Hash",
    minutes: 85,
    examWeight: 10,
    visual: "hash",
    hook: "Hash tablo, veriyi doğru kovaya hızlı koyup hızlı bulmaya yarar.",
    concept:
      "Hash fonksiyonu veriden bir indeks üretir. Örneğin harf kodlarını toplayıp mod almak bir hash olabilir. İki veri aynı indekse düşerse çarpışma olur. Çarpışma zincirleme veya açık adresleme gibi yöntemlerle çözülür.",
    analogy:
      "Okulda dolap numarası gibi düşün. Öğrenci numarandan dolap numaran hesaplanıyor. İki öğrenci aynı dolaba düşerse ya dolabın içine liste yapılır ya da yakın boş dolap aranır.",
    examPattern:
      "Final listesinde `hash tablosuna şu değerler yüklendiğinde` ve `çarpışmayla başa çıkma yöntemleri` soruları özellikle geçiyor.",
    codeReading:
      "`%` mod işlemi hash sorularında kovayı bulur. `hash = key % tableSize` gibi bir ifade görürsen kalan değer indeks olur.",
    mustKnow: ["Ortalama arama/ekleme/silme O(1).", "Çarpışma aynı indekse düşmedir.", "Zincirleme aynı kovada liste tutar.", "Linear probing, quadratic probing ve double hashing açık adresleme ailesindedir."],
    practice: [
      {
        id: "hash-1",
        topic: "Hash",
        level: "kolay",
        prompt: "`23 % 10` hash indeksini kaç yapar?",
        options: ["2", "3", "10", "23"],
        answer: "3",
        shortExplanation: "23'ün 10'a bölümünden kalan 3'tür.",
        simpleExplanation: "23 elmayı 10'arlı ayırınca 3 elma artar.",
        examThinking: "Hash tablosunda mod sorusu görürsen kalan sayıyı indeks olarak kullan.",
      },
      {
        id: "hash-2",
        topic: "Çarpışma",
        level: "orta",
        prompt: "Tablo boyutu 10 ise 12 ve 22 aynı indekse düşer mi?",
        options: ["Evet, ikisi de 2", "Hayır", "Evet, ikisi de 10", "Sadece 12 düşer"],
        answer: "Evet, ikisi de 2",
        shortExplanation: "12 % 10 = 2 ve 22 % 10 = 2 olduğu için çarpışma olur.",
        simpleExplanation: "İki öğrenci aynı dolap numarasını aldı; bu çarpışmadır.",
        examThinking: "Her anahtar için mod al, aynı sonuç varsa çarpışma de.",
      },
      {
        id: "hash-3",
        topic: "Çarpışma",
        level: "sinav",
        prompt: "Aynı kovada birden fazla elemanı liste olarak tutmaya ne denir?",
        options: ["Zincirleme", "Bubble", "Rotasyon", "Binary search"],
        answer: "Zincirleme",
        shortExplanation: "Chaining, aynı kovada liste/dizi ile birden çok eleman tutar.",
        simpleExplanation: "Aynı dolaba düşenleri dolabın içine isim listesi yaparak tutmak gibi.",
        examThinking: "Çarpışma çözümünde `aynı kovada liste` ifadesi zincirlemedir.",
      },
    ],
  },
  {
    id: "linked-list",
    title: "Linked List: Düğüm ve Bağlantılar",
    shortTitle: "Linked List",
    minutes: 90,
    examWeight: 11,
    visual: "linked",
    hook: "Linked list, elemanları yan yana kutularda değil, birbirini gösteren düğümlerde tutar.",
    concept:
      "Bağlı listede her düğüm veri ve bir sonraki düğümün adresini tutar. `head` ilk düğüm, `tail` son düğümdür. Diziden farkı, rastgele erişimin yavaş; ekleme/silmenin doğru yeri biliyorsan kolay olmasıdır.",
    analogy:
      "Tren vagonları gibi düşün. Her vagon bir sonrakine bağlıdır. Ortaya yeni vagon eklemek için tüm vagonları kaydırmazsın; bağlantıları değiştirirsin.",
    examPattern:
      "Final listesinde linked list kavramları, diziye göre avantaj/dezavantaj, ekleme-silme maliyetleri, dairesel ve çift yönlü listeler özellikle var.",
    codeReading:
      "`node.next` bir sonraki düğümü gösterir. `head = head.next` baştaki düğümü silme gibi düşünülebilir. `prev` varsa çift yönlü listedir.",
    mustKnow: ["Arama O(n).", "Dizide rastgele erişim O(1), linked listte O(n).", "Yer biliniyorsa ekleme/silme O(1) olabilir.", "Her düğüm bağlantı tuttuğu için ekstra bellek harcar."],
    practice: [
      {
        id: "linked-1",
        topic: "Linked List",
        level: "kolay",
        prompt: "Linked listte düğüm genelde hangi iki bilgiyi tutar?",
        options: ["Veri ve bağlantı", "Sadece indis", "Sadece boyut", "Sadece sıralama"],
        answer: "Veri ve bağlantı",
        shortExplanation: "Düğüm veri ve en az bir sonraki düğüm bağlantısını tutar.",
        simpleExplanation: "Vagonun içinde yük var, ayrıca sonraki vagona bağlanan kanca var.",
        examThinking: "Node = data + next. Bu formülü unutma.",
      },
      {
        id: "linked-2",
        topic: "Dizi vs Linked List",
        level: "orta",
        prompt: "Linked listin diziye göre avantajı hangisidir?",
        options: ["İndisle direkt erişim daha hızlıdır", "Ekleme/silmede kaydırma gerektirmez", "Daha az bellek kullanır", "Her zaman sıralıdır"],
        answer: "Ekleme/silmede kaydırma gerektirmez",
        shortExplanation: "Bağlantılar değiştirilerek ekleme/silme yapılabilir.",
        simpleExplanation: "Ortaya vagon eklemek için bütün trenin yerini kaydırmazsın; kancaları değiştirirsin.",
        examThinking: "Dizi güçlü tarafı direkt erişim; linked list güçlü tarafı bağlantı değiştirerek ekleme/silme.",
      },
      {
        id: "linked-3",
        topic: "Maliyet",
        level: "sinav",
        prompt: "Linked listte arama işlemi neden O(n)'dir?",
        options: ["Her düğüm sırayla gezilebilir", "Her zaman ikiye bölünür", "İndisle direkt gidilir", "Hash fonksiyonu kullanır"],
        answer: "Her düğüm sırayla gezilebilir",
        shortExplanation: "Aranan düğüme ulaşmak için baştan başlayıp bağlantıları takip etmek gerekir.",
        simpleExplanation: "Vagon 8'i bulmak için 1'den başlayıp vagon vagon ilerlersin.",
        examThinking: "Linked listte `rastgele erişim yok` bilgisini O(n) aramayla bağla.",
      },
    ],
  },
  {
    id: "circular-doubly",
    title: "Dairesel ve Çift Yönlü Listeler",
    shortTitle: "Liste Türleri",
    minutes: 50,
    examWeight: 8,
    visual: "circular",
    hook: "Liste bağlantısının yönü değişirse kullanım şekli de değişir.",
    concept:
      "Tek yönlü listede düğüm sadece sonrakini bilir. Çift yönlü listede hem sonraki hem önceki düğüm bilinir. Dairesel listede son düğüm tekrar başa bağlanır. Çift yönlü liste gezmeyi kolaylaştırır ama ekstra bağlantı tuttuğu için bellek maliyeti artar.",
    analogy:
      "Tek yönlü yol sadece ileri gider. Çift yönlü yol ileri-geri gitmeyi sağlar. Ring servis ise son duraktan tekrar ilk durağa döner; bu da dairesel listedir.",
    examPattern:
      "`Çift yönlü listelerin dezavantajı nedir?`, `Dairesel liste nerede işe yarar?`, `ileri/geri bağlantı ne demek?` tarzı kavram soruları beklenir.",
    codeReading:
      "`next` ve `prev` birlikte varsa çift yönlü liste. `tail.next = head` gibi bir bağlantı varsa dairesel liste mantığı vardır.",
    mustKnow: ["Çift yönlü liste ileri ve geri gezilebilir.", "Dezavantajı ekstra bellek ve daha karmaşık bağlantı güncellemesidir.", "Dairesel listede son başa bağlanır.", "Baş/son tespiti için dikkat gerekir."],
    practice: [
      {
        id: "circular-1",
        topic: "Çift Yönlü Liste",
        level: "kolay",
        prompt: "Çift yönlü listede tek yönlü listeden farklı olarak ne bulunur?",
        options: ["prev bağlantısı", "Dizi indisi", "Hash kodu", "Pivot"],
        answer: "prev bağlantısı",
        shortExplanation: "Çift yönlü liste önceki düğümü de tutar.",
        simpleExplanation: "Geri gidebilmek için arkadaki vagona da kanca gerekir.",
        examThinking: "Çift yönlü = next + prev.",
      },
      {
        id: "circular-2",
        topic: "Dairesel Liste",
        level: "orta",
        prompt: "Dairesel listede son düğüm genelde nereye bağlanır?",
        options: ["Null'a", "İlk düğüme", "Ortadaki düğüme", "Kendinden önceki düğüme"],
        answer: "İlk düğüme",
        shortExplanation: "Dairesel yapıda tail tekrar head'e bağlanır.",
        simpleExplanation: "Ring servis son duraktan sonra tekrar ilk durağa gelir.",
        examThinking: "Dairesel kelimesi görürsen sonun başa döndüğünü düşün.",
      },
      {
        id: "circular-3",
        topic: "Çift Yönlü Liste",
        level: "sinav",
        prompt: "Çift yönlü listenin dezavantajı hangisidir?",
        options: ["Geri gidemez", "Ekstra bellek kullanır", "Hiç eleman silemez", "Her zaman sabit boyutludur"],
        answer: "Ekstra bellek kullanır",
        shortExplanation: "Her düğüm `prev` bağlantısı da tuttuğu için daha fazla bellek gerekir.",
        simpleExplanation: "Her vagona ikinci kanca takmak malzeme ve dikkat ister.",
        examThinking: "Avantaj ileri-geri gezme; dezavantaj ekstra bellek ve bağlantı karmaşıklığı.",
      },
    ],
  },
  {
    id: "functions-string",
    title: "Fonksiyonlar ve String İşlemleri",
    shortTitle: "Fonksiyon / String",
    minutes: 60,
    examWeight: 9,
    visual: "string",
    hook: "String soruları genelde metni büyütme, küçültme, parçalama ve ters çevirme etrafında gelir.",
    concept:
      "Fonksiyon belirli işi yapan kod bloğudur. String ise metindir. C#'ta `Length` uzunluğu, `ToUpper()` büyük harfi, `ToLower()` küçük harfi, `Split()` parçalamayı, `Substring()` metinden parça almayı sağlar.",
    analogy:
      "Metni bir cümle şeridi gibi düşün. Makasla parçalarsan Split, harfleri büyütürsen ToUpper, küçük yaparsan ToLower, şeridi ters çevirirsen reverse mantığıdır.",
    examPattern:
      "Final listesinde `String büyük harf küçük harf parçala tersine çevir` ve fonksiyon kavramları açıkça var.",
    codeReading:
      "Metot sonunda parantez varsa işlem yapılır: `txt.ToUpper()`. Özellik gibi kullanılan `txt.Length` parantezsizdir. `Split(' ')` boşluklardan ayırır.",
    mustKnow: ["`Length` string uzunluğudur.", "`ToUpper()` büyük harfe çevirir.", "`ToLower()` küçük harfe çevirir.", "`Split(' ')` boşluklardan parçalar."],
    practice: [
      {
        id: "string-1",
        topic: "String",
        level: "kolay",
        prompt: "C# string uzunluğunu bulmak için hangisi kullanılır?",
        options: ["GetLength", "Length", "Size()", "CountAll"],
        answer: "Length",
        shortExplanation: "C# string ve dizilerde uzunluk için `Length` kullanılır.",
        simpleExplanation: "Metnin kaç harf olduğunu sayan etiket gibi düşün.",
        examThinking: "Vizede de string uzunluğu için doğru cevap `Length` tarzındaydı.",
      },
      {
        id: "string-2",
        topic: "String",
        level: "orta",
        prompt: "Aşağıdaki kod ne yazar?",
        code: "string txt = \"banü\";\nConsole.WriteLine(txt.ToUpper());",
        options: ["banü", "BANÜ", "Banü", "4"],
        answer: "BANÜ",
        shortExplanation: "`ToUpper()` metni büyük harfe çevirir.",
        simpleExplanation: "Metindeki harflerin sesini yükseltmek gibi: küçükler büyür.",
        examThinking: "`Upper` büyük, `Lower` küçük demektir.",
      },
      {
        id: "string-3",
        topic: "String",
        level: "sinav",
        prompt: "`\"ali veli fatma\".Split(' ')` sonucunda kaç parça oluşur?",
        options: ["1", "2", "3", "14"],
        answer: "3",
        shortExplanation: "Boşluklardan ayrılınca `ali`, `veli`, `fatma` olmak üzere 3 parça oluşur.",
        simpleExplanation: "Cümleyi boşluklardan makasla kesiyorsun; üç kelime çıkıyor.",
        examThinking: "`Split(' ')` gördüğünde kelime sayısını say.",
      },
    ],
  },
  {
    id: "trees",
    title: "Ağaçlar ve BST Kısa Tekrar",
    shortTitle: "Ağaç/BST",
    minutes: 40,
    examWeight: 4,
    visual: "tree",
    hook: "Ağaçlar finalde düşük öncelikli; rotasyon yok, kavram ve BST mantığı yeterli.",
    concept:
      "Ağaç doğrusal olmayan veri yapısıdır. En üstte kök vardır, altındaki düğümler çocuk olarak düşünülür. Binary tree'de her düğümün en fazla iki çocuğu olur. Binary Search Tree'de sol taraf küçük, sağ taraf büyük değerleri tutar.",
    analogy:
      "Aile ağacı gibi düşün. En üstte kök kişi var, aşağıya doğru çocuklar dallanıyor. BST'de de küçükler sol dalda, büyükler sağ dalda kalır.",
    examPattern:
      "Rotasyon beklenmiyor. Gelirse `kök/yaprak nedir?`, `BST'de küçük değer nereye gider?`, `in-order gezi artan sıralama verir mi?` gibi kavram sorusu beklenir.",
    codeReading:
      "`left` ve `right` görürsen ikili ağaç. `if (value < node.data) node.left` gibi ifade görürsen BST mantığıdır.",
    mustKnow: ["Root kök düğümdür.", "Leaf çocuk düğümü olmayan yapraktır.", "BST'de küçükler sola, büyükler sağa gider.", "Dengeli BST arama O(log n) olabilir."],
    practice: [
      {
        id: "tree-1",
        topic: "Ağaç",
        level: "kolay",
        prompt: "Ağaç veri yapısındaki en üst düğüme ne denir?",
        options: ["Kök", "Yaprak", "Pivot", "Kova"],
        answer: "Kök",
        shortExplanation: "Ağacın başlangıç düğümü root/kök olarak adlandırılır.",
        simpleExplanation: "Aile ağacının en tepesindeki kişi gibi.",
        examThinking: "Root = kök. Leaf = yaprak.",
      },
      {
        id: "tree-2",
        topic: "BST",
        level: "orta",
        prompt: "BST'de mevcut düğümden küçük değer genelde hangi tarafa gider?",
        options: ["Sola", "Sağa", "Her zaman köke", "Silinir"],
        answer: "Sola",
        shortExplanation: "Binary Search Tree kuralında küçük değerler sol alt ağaçta tutulur.",
        simpleExplanation: "BST'yi iki kapılı oda gibi düşün: küçükler sol kapıdan girer.",
        examThinking: "BST kuralı: sol küçük, sağ büyük.",
      },
      {
        id: "tree-3",
        topic: "Traversal",
        level: "sinav",
        prompt: "BST'de in-order traversal genellikle hangi sırayı verir?",
        options: ["Rastgele", "Azalan", "Artan", "Sadece kök"],
        answer: "Artan",
        shortExplanation: "In-order sırası sol, kök, sağ olduğu için BST'de değerleri artan verir.",
        simpleExplanation: "Önce küçükleri, sonra ortayı, sonra büyükleri okursun.",
        examThinking: "BST + in-order = artan sıralama bilgisi kısa ama puan getirir.",
      },
    ],
  },
];

// Ders kimlikleri ilerleme kayıtlarında kullanılıyor. Kataloğu yerinde
// bırakıp yalnızca eğitim yolunu sıralamak, mevcut öğrenci ilerlemesini korur.
const learningOrder = [
  "csharp",
  "functions-string",
  "big-o",
  "search",
  "sorting",
  "stack",
  "queue",
  "linked-list",
  "circular-doubly",
  "hash",
  "trees",
] as const;

export const lessons: Lesson[] = learningOrder.map((lessonId) => {
  const lesson = lessonCatalog.find((item) => item.id === lessonId);

  if (!lesson) {
    throw new Error(`Ders kataloğunda '${lessonId}' bulunamadı.`);
  }

  return lesson;
});

function q(
  id: string,
  topic: string,
  level: QuestionLevel,
  prompt: string,
  options: string[],
  answer: string,
  explanation: string,
  code?: string,
): PracticeQuestion {
  return {
    id,
    topic,
    level,
    prompt,
    code,
    options,
    answer,
    shortExplanation: explanation,
    simpleExplanation: explanation,
    examThinking: explanation,
  };
}

const lessonBoosts: Record<string, PracticeQuestion[]> = {
  csharp: [
    q("csharp-4", "C# Temel", "kolay", "`int[] a = {10, 20, 30, 40};` için `a[0]` kaçtır?", ["10", "20", "0", "40"], "10", "Dizilerde ilk elemanın indisi 0'dır."),
    q("csharp-5", "C# Temel", "orta", "`int[] a = {10, 20, 30, 40};` için `a.Length` kaçtır?", ["3", "4", "10", "40"], "4", "`Length` dizideki eleman sayısını verir."),
    q("csharp-6", "C# Temel", "orta", "Bu kod ekrana ne yazar?", ["0 1 2", "1 2 3", "0 1 2 3", "3"], "0 1 2", "`i < 3` olduğu için i değerleri 0, 1, 2 olur.", "for (int i = 0; i < 3; i++)\n{\n    Console.Write(i + \" \");\n}"),
    q("csharp-7", "Fonksiyon", "sinav", "`void` fonksiyon için doğru ifade hangisidir?", ["Değer döndürmez", "Her zaman int döndürür", "Dizi oluşturur", "Sadece string alır"], "Değer döndürmez", "`void`, fonksiyonun geriye değer döndürmediğini gösterir."),
    q("csharp-8", "C# Temel", "sinav", "Bu kod ekrana ne yazar?", ["5", "6", "10", "Hata"], "6", "x önce 5'tir, `x++` ile 6 olur.", "int x = 5;\nx++;\nConsole.WriteLine(x);"),
  ],
  "big-o": [
    q("big-o-4", "Big O", "kolay", "En hızlı büyüme hangisidir?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], "O(1)", "O(1) veri sayısından etkilenmeyen sabit zamandır."),
    q("big-o-5", "Big O", "orta", "Hangisi genelde binary search karmaşıklığıdır?", ["O(1)", "O(log n)", "O(n)", "O(n²)"], "O(log n)", "Binary search her adımda arama alanını yarıya indirir."),
    q("big-o-6", "Big O", "sinav", "Hangisi küçükten büyüğe doğru doğru sıralamadır?", ["O(1), O(log n), O(n), O(n log n), O(n²)", "O(n²), O(n), O(1), O(log n)", "O(log n), O(1), O(n²), O(n)", "O(n), O(1), O(n log n), O(log n)"], "O(1), O(log n), O(n), O(n log n), O(n²)", "Sınavda order sıralaması böyle beklenir."),
    q("big-o-7", "Big O", "sinav", "Bu kodun karmaşıklığı nedir?", ["O(1)", "O(n)", "O(n²)", "O(log n)"], "O(n²)", "İç içe iki döngü n*n çalışma üretir.", "for (int i = 0; i < n; i++)\n{\n  for (int j = 0; j < n; j++)\n  {\n    Console.WriteLine(i+j);\n  }\n}"),
    q("big-o-8", "Big O", "orta", "Dizide indisi bilinen elemana erişmek genelde nedir?", ["O(1)", "O(n)", "O(n²)", "O(n!)"], "O(1)", "Dizi doğrudan indisle erişim sağlar."),
  ],
  stack: [
    q("stack-4", "Stack", "orta", "`Push(9), Push(1), Peek()` sonucu nedir?", ["9", "1", "10", "Boş"], "1", "Peek en üsttekine bakar; en üstte 1 vardır."),
    q("stack-5", "Stack", "orta", "`Push(4), Push(7), Pop(), Pop()` son Pop kaç döndürür?", ["4", "7", "Boş", "11"], "4", "İlk Pop 7'yi, ikinci Pop 4'ü çıkarır."),
    q("stack-6", "Stack", "sinav", "Parantez kontrolünde sol parantez okununca ne yapılır?", ["Stack'e push edilir", "Queue'ya enqueue edilir", "Silinir", "Hashlenir"], "Stack'e push edilir", "Açılan parantezler stack'e eklenir; kapanınca pop yapılır."),
    q("stack-7", "Stack", "sinav", "Stack boşken `Pop()` yapılırsa ne olur?", ["Hata/istisna oluşur", "0 döner", "En alttaki çıkar", "Peek çalışır"], "Hata/istisna oluşur", "Boş yığından eleman çıkarılamaz."),
  ],
  search: [
    q("search-4", "Linear Search", "orta", "`[5, 9, 2, 7]` dizisinde 7 linear search ile kaçıncı kontrolde bulunur?", ["1", "2", "3", "4"], "4", "Linear search soldan sağa tek tek bakar; 7 dördüncü elemandır."),
    q("search-5", "Binary Search", "sinav", "Binary search neden sıralı dizi ister?", ["Ortadan bakınca yön seçebilmek için", "Daha çok bellek için", "Stack kullandığı için", "String istediği için"], "Ortadan bakınca yön seçebilmek için", "Sıralı değilse küçük/büyük yön kararı anlamsız olur."),
    q("search-6", "Arama", "kolay", "Arama algoritmaları genelde diziyi ne yapar?", ["Değiştirmez", "Her zaman sıralar", "Her zaman ters çevirir", "Silme yapar"], "Değiştirmez", "Arama bulmaya çalışır; sıralama gibi diziyi düzenlemez."),
  ],
  queue: [
    q("queue-4", "Queue", "orta", "`Enqueue(4), Enqueue(9), Peek()` sonucu nedir?", ["4", "9", "13", "Boş"], "4", "Peek kuyruğun önündeki ilk gelen elemana bakar."),
    q("queue-5", "Queue", "sinav", "`Enqueue(6), Enqueue(1), Dequeue(), Peek()` sonucu nedir?", ["6", "1", "Boş", "7"], "1", "Dequeue 6'yı çıkarır, önde 1 kalır."),
    q("queue-6", "Queue", "sinav", "Kuyruk için array kullanmanın dezavantajı hangisidir?", ["Dequeue sonrası kaydırma maliyeti", "LIFO olması", "Hash kullanması", "Pivot seçmesi"], "Dequeue sonrası kaydırma maliyeti", "Dizi tabanlı kuyrukta önden silince elemanları kaydırmak gerekebilir."),
    q("queue-7", "Queue", "kolay", "Queue mantığı hangi kısaltmadır?", ["FIFO", "LIFO", "BST", "RPN"], "FIFO", "First In First Out: ilk giren ilk çıkar."),
  ],
  sorting: [
    q("sorting-4", "Insertion Sort", "kolay", "Insertion Sort nasıl düşünülür?", ["Eldeki kartı doğru yere sokma", "En büyük elemanı silme", "Hashleme", "Kuyruğa ekleme"], "Eldeki kartı doğru yere sokma", "Insertion Sort sıralı bölüme yeni elemanı uygun yere yerleştirir."),
    q("sorting-5", "Bubble Sort", "orta", "Bubble Sort bir tam turdan sonra `[3, 2, 1]` nasıl olur?", ["[2, 1, 3]", "[1, 2, 3]", "[3, 1, 2]", "[2, 3, 1]"], "[2, 1, 3]", "3 önce 2 ile, sonra 1 ile yer değiştirir ve sona gider."),
    q("sorting-6", "Quick Sort", "sinav", "Quick Sort'ta pivotun görevi nedir?", ["Diziyi küçükler ve büyükler diye ayırmak", "Diziyi ters çevirmek", "Eleman saymak", "Kuyruktan silmek"], "Diziyi küçükler ve büyükler diye ayırmak", "Pivot seçilir; küçükler sola, büyükler sağa ayrılır."),
    q("sorting-7", "Counting Sort", "sinav", "Counting Sort ilk olarak ne oluşturur?", ["Sayma/frekans dizisi", "Stack", "BST", "Queue"], "Sayma/frekans dizisi", "Her değerden kaç tane olduğunu tutmak için sayma dizisi oluşturulur."),
    q("sorting-8", "Counting Sort", "orta", "`[2, 0, 2, 1]` için 2 değeri kaç kez sayılır?", ["1", "2", "3", "0"], "2", "Dizide 2 değeri iki kez geçer."),
    q("sorting-9", "Selection Sort", "sinav", "Selection Sort kodunda genelde hangi değişken görülür?", ["min_index", "front", "rear", "hashCode"], "min_index", "Selection Sort her tur minimumun indeksini takip eder."),
  ],
  hash: [
    q("hash-4", "Hash", "sinav", "Hash çarpışmasıyla başa çıkma yöntemlerinden biri değildir?", ["Bubble Sort", "Zincirleme", "Linear probing", "Double hashing"], "Bubble Sort", "Bubble Sort sıralama algoritmasıdır, hash çarpışma yöntemi değildir."),
    q("hash-5", "Hash", "sinav", "Linear probing çarpışmada ne yapar?", ["Sıradaki boş kovayı arar", "Aynı kovada liste açar", "Ağacı döndürür", "Diziyi sıralar"], "Sıradaki boş kovayı arar", "Linear probing çarpışınca bir sonraki kovaları sırayla dener."),
    q("hash-6", "Hash", "sinav", "Quadratic probing hangi adımlarla ilerler?", ["1², 2², 3² gibi", "Her zaman +1", "Daima başa döner", "Stack pop yapar"], "1², 2², 3² gibi", "Quadratic probing karesel uzaklıklarla yeni kova arar."),
    q("hash-7", "Hash", "sinav", "Double hashing ne kullanır?", ["İkinci hash fonksiyonu", "İkinci dizi türü", "İkinci stack", "İkinci pivot"], "İkinci hash fonksiyonu", "Double hashing çarpışma sonrası adım boyunu ikinci hash ile belirler."),
    q("hash-8", "Hash", "orta", "Tablo boyutu 7 ise `15 % 7` kaçtır?", ["1", "2", "7", "15"], "1", "15'in 7'ye bölümünden kalan 1'dir."),
    q("hash-9", "Hash", "sinav", "Tablo boyutu 5, linear probing. 7 ve 12 hangi ilk kovaya düşer?", ["İkisi de 2", "7->1, 12->2", "İkisi de 0", "7->2, 12->3"], "İkisi de 2", "7%5=2 ve 12%5=2; çarpışma olur."),
  ],
  "linked-list": [
    q("linked-4", "Linked List", "sinav", "Linked listte baştan arama maliyeti nedir?", ["O(n)", "O(1)", "O(log n)", "O(n²)"], "O(n)", "Baştan başlayıp düğüm düğüm ilerlemek gerekir."),
    q("linked-5", "Linked List", "sinav", "Head biliniyorsa başa ekleme maliyeti genelde nedir?", ["O(1)", "O(n)", "O(n²)", "O(log n)"], "O(1)", "Yeni düğümün next'i eski head yapılır, head güncellenir."),
    q("linked-6", "Linked List", "sinav", "Tail yoksa sona ekleme neden O(n) olabilir?", ["Sona ulaşmak için tüm liste gezilir", "Dizi sıralanır", "Hash gerekir", "Stack boşalır"], "Sona ulaşmak için tüm liste gezilir", "Tail referansı yoksa son düğümü bulmak için baştan gezilir."),
    q("linked-7", "Dizi vs Linked List", "orta", "Diziye ortadan eleman eklemenin dezavantajı nedir?", ["Kaydırma gerekebilir", "İndis yoktur", "Her eleman next tutar", "FIFO çalışır"], "Kaydırma gerekebilir", "Dizide ortadan eklemede sonraki elemanlar kaydırılır."),
    q("linked-8", "Linked List", "kolay", "`head` neyi gösterir?", ["İlk düğümü", "Son düğümü", "Pivotu", "Hash kodunu"], "İlk düğümü", "Head bağlı listenin başlangıç düğümüdür."),
  ],
  "circular-doubly": [
    q("circular-4", "Çift Yönlü Liste", "orta", "Çift yönlü listede hangi iki bağlantı vardır?", ["next ve prev", "front ve rear", "push ve pop", "key ve value"], "next ve prev", "Çift yönlü liste hem ileri hem geri bağlantı tutar."),
    q("circular-5", "Dairesel Liste", "sinav", "Dairesel listede sonsuz döngü riski neden vardır?", ["Son düğüm başa bağlandığı için", "Dizi sıralı olduğu için", "Hash kullandığı için", "Sadece tek eleman olduğu için"], "Son düğüm başa bağlandığı için", "Gezme durdurulmazsa son tekrar başa döner."),
    q("circular-6", "Dairesel Liste", "orta", "Dairesel liste hangi gerçek hayat örneğine benzer?", ["Ring servis", "Tek kullanımlık bilet", "Apartman numarası", "Telefon rehberi"], "Ring servis", "Ring servis son duraktan sonra tekrar ilk durağa döner."),
  ],
  "functions-string": [
    q("string-4", "String", "kolay", "`\"Umut\".Length` kaçtır?", ["3", "4", "5", "0"], "4", "U, m, u, t olmak üzere 4 karakter vardır."),
    q("string-5", "String", "orta", "`\"BANU\".ToLower()` sonucu nedir?", ["banu", "BANU", "Banu", "4"], "banu", "ToLower tüm harfleri küçük yapar."),
    q("string-6", "String", "sinav", "Bir stringi ters çevirmek için temel fikir hangisidir?", ["Sondan başa doğru karakter okumak", "Hash tablosu kurmak", "Queue Dequeue yapmak", "Pivot seçmek"], "Sondan başa doğru karakter okumak", "Ters çevirme için son karakterden başa doğru ilerlenir."),
    q("string-7", "String", "sinav", "Bu kod ne yazar?", ["c", "d", "b", "4"], "c", "txt[2] üçüncü karakterdir; indisler 0'dan başlar.", "string txt = \"abcd\";\nConsole.WriteLine(txt[2]);"),
    q("string-8", "String", "orta", "`Split(' ')` hangi karakterden böler?", ["Boşluk", "Virgül", "Nokta", "Hiçbiri"], "Boşluk", "`' '` boşluk karakteridir."),
  ],
  trees: [
    q("tree-4", "BST", "orta", "BST'de 12, kök 8'e göre nereye gider?", ["Sağa", "Sola", "Köke", "Silinir"], "Sağa", "12, 8'den büyük olduğu için sağa gider."),
    q("tree-5", "Ağaç", "kolay", "Çocuğu olmayan düğüme ne denir?", ["Yaprak", "Kök", "Pivot", "Kova"], "Yaprak", "Leaf/yaprak düğümün çocuğu yoktur."),
  ],
};

for (const lesson of lessons) {
  lesson.practice.push(...(lessonBoosts[lesson.id] ?? []));
}

export const examBank: PracticeQuestion[] = [
  ...lessons.flatMap((lesson) => lesson.practice),
  {
    id: "exam-extra-1",
    topic: "Hash",
    level: "sinav",
    prompt: "Hash tablosunda iki anahtar aynı indeksi üretirse buna ne denir?",
    options: ["Çarpışma", "Rotasyon", "Traversal", "Deque"],
    answer: "Çarpışma",
    shortExplanation: "Aynı kova/indeks iki farklı değere denk gelirse çarpışma oluşur.",
    simpleExplanation: "İki kişinin aynı dolap numarasını alması gibi.",
    examThinking: "Hash + aynı indeks = çarpışma.",
  },
  {
    id: "exam-extra-2",
    topic: "Linked List",
    level: "sinav",
    prompt: "Dizilerin linked listlere göre en önemli avantajı hangisidir?",
    options: ["İndisle direkt erişim", "Daha karmaşık olması", "Her düğümde next tutması", "Sadece sona ekleme"],
    answer: "İndisle direkt erişim",
    shortExplanation: "Dizide `dizi[5]` gibi doğrudan erişim O(1)'dir.",
    simpleExplanation: "Apartman daire numarasını biliyorsan direkt o daireye çıkmak gibi.",
    examThinking: "Dizi = hızlı indeks. Linked list = bağlantı değiştirerek ekleme/silme.",
  },
  {
    id: "exam-extra-3",
    topic: "Counting Sort",
    level: "sinav",
    prompt: "Counting Sort neden negatif sayılarda doğrudan rahat kullanılmaz?",
    options: ["Dizi indeksleri negatif olamaz", "Çok hızlı olduğu için", "Karşılaştırma yapmadığı için", "Sadece string sıralar"],
    answer: "Dizi indeksleri negatif olamaz",
    shortExplanation: "Counting sort değeri indeks gibi kullandığından negatif değerler özel düzenleme gerektirir.",
    simpleExplanation: "Dolap numarası -3 olamaz; bu yüzden doğrudan kutuya koyamazsın.",
    examThinking: "Counting Sort = değer indeks olur. Negatif değer sorun çıkarır.",
  },
  {
    id: "exam-extra-4",
    topic: "Queue",
    level: "sinav",
    prompt: "`Enqueue(1), Enqueue(2), Dequeue(), Enqueue(3)` sonrası kuyrukta ne kalır?",
    options: ["1, 2", "2, 3", "3, 2", "1, 3"],
    answer: "2, 3",
    shortExplanation: "İlk giren 1 çıkar; 2 önde, 3 arkada kalır.",
    simpleExplanation: "Sıranın başındaki 1 gitti, 3 en arkaya eklendi.",
    examThinking: "Queue sorusunda Dequeue önden siler.",
  },
  {
    id: "exam-extra-5",
    topic: "Stack",
    level: "sinav",
    prompt: "`Push(1), Push(2), Push(3), Pop(), Peek()` sonucunda Peek kaçtır?",
    options: ["1", "2", "3", "Boş"],
    answer: "2",
    shortExplanation: "Pop 3'ü çıkarır; tepede 2 kalır.",
    simpleExplanation: "En üstteki 3 tabağı aldın, altında 2 var.",
    examThinking: "Pop çıkarır, Peek kalan tepeye bakar.",
  },
];

export const allQuestions = lessons.flatMap((lesson) => lesson.practice);

export const cramRules = [
  "Stack = LIFO = son giren ilk çıkar.",
  "Queue = FIFO = ilk giren ilk çıkar.",
  "Tek döngü O(n), iç içe iki döngü O(n²).",
  "Binary search O(log n) ama dizi sıralı olmalı.",
  "Quick Sort ortalama O(n log n), en kötü O(n²).",
  "Counting Sort küçük aralıklı, negatif olmayan tam sayılarda mantıklı.",
  "Linked list arama O(n), dizi indisiyle erişim O(1).",
  "Çift yönlü liste ekstra bellek kullanır çünkü prev de tutar.",
  "Hash çarpışması iki değerin aynı kovaya düşmesidir.",
  "C# string uzunluğu için Length kullanılır.",
];

export function getExamQuestions(variant = 0) {
  const targetTopics = [
    "Stack",
    "Queue",
    "Hash",
    "Linked List",
    "Dizi vs Linked List",
    "Big O",
    "Quick Sort",
    "Selection Sort",
    "Counting Sort",
    "String",
    "Fonksiyon",
    "C# Temel",
    "Arama",
    "Binary Search",
    "Çift Yönlü Liste",
    "Dairesel Liste",
    "BST",
  ];
  const ordered = examBank
    .map((question, index) => ({ question, index }))
    .sort((a, b) => {
      const aTopic = targetTopics.indexOf(a.question.topic);
      const bTopic = targetTopics.indexOf(b.question.topic);
      const safeA = aTopic === -1 ? targetTopics.length : aTopic;
      const safeB = bTopic === -1 ? targetTopics.length : bTopic;
      return safeA - safeB || a.index - b.index;
    })
    .map(({ question }) => question);
  const offset = (variant * 7) % ordered.length;
  return Array.from({ length: 20 }, (_, index) => ordered[(offset + index) % ordered.length]);
}
