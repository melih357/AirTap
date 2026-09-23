**# AirTap — A’dan Z’ye Proje Tanımı ve Geliştirme Şartnamesi**

**## 1. Belgenin amacı**

Bu belge, **\*\*AirTap\*\*** isimli tarayıcı tabanlı el hareketi ve artırılmış gerçeklik efekt uygulamasının fikir aşamasından çalışan ürüne kadar bütün ayrıntılarını tanımlar. Tasarımcı, yazılımcı veya yapay zekâ destekli bir kodlama aracı bu belgeyi okuyarak projenin ne yapacağını, nasıl görüneceğini, kullanıcı hareketlerinin nasıl algılanacağını ve hangi sırayla geliştirileceğini anlayabilmelidir.

Bu metin aynı zamanda doğrudan kopyalanıp bir proje geliştirme aracına verilebilecek ana proje açıklamasıdır.

**---**

**## 2. Proje kimliği**

\- **\*\*Proje adı:\*\*** AirTap
\- **\*\*Proje türü:\*\*** Kamera tabanlı, el hareketleriyle kontrol edilen web uygulaması
\- **\*\*Kısa tanım:\*\*** Kullanıcının parmak ve el hareketlerini algılayarak havada efekt seçmesini ve elini ileri ittiğinde seçtiği efekti fırlatmasını sağlayan eğlenceli kamera uygulaması
\- **\*\*Ana slogan:\*\*** **\*\*Havaya dokun, gücünü seç.\*\***
\- **\*\*Alternatif slogan:\*\*** **\*\*Ellerin artık kumandan.\*\***
\- **\*\*İlk platform:\*\*** Bilgisayar ve telefon tarayıcısı
\- **\*\*İlk çalışma şekli:\*\*** Tek kullanıcı, tek kamera ve cihaz üzerinde işlem
\- **\*\*İlerideki platformlar:\*\*** Android, iOS ve iki kişilik görüntülü görüşme

**---**

**## 3. Temel fikir**

AirTap açıldığında kullanıcının kamerası çalışır ve uygulama ekrandaki eli gerçek zamanlı olarak takip eder. Kullanıcı sadece işaret parmağını kaldırdığında, parmağın çevresinde dairesel bir efekt menüsü belirir. Kullanıcı parmağını bir efektin üzerine getirir ve havada iki kez dokunma hareketi yapar. Seçilen efekt kaydedilir ve menü kapanır.

Bundan sonra kullanıcı açık avucunu kameraya gösterip elini hızlı şekilde kameraya doğru ittiğinde, seçtiği efekt avucundan fırlar. Kullanıcı başka bir efekt seçene kadar aynı efekt kullanılmaya devam eder.

Örnek kullanım:

1\. Kullanıcı işaret parmağını kaldırır.
2\. Efekt çarkı açılır.
3\. Parmağını “Alev Topu” seçeneğine götürür.
4\. Havada iki kez ileri dokunur.
5\. “Alev Topu seçildi” bildirimi görünür.
6\. Kullanıcı açık avucunu gösterir.
7\. Elini kameraya doğru iter.
8\. Avucundan alev topu çıkar ve ekranda ileri doğru uçar.
9\. Kullanıcı efekt değiştirmediği sürece her ileri itişinde alev topu fırlatır.

**---**

**## 4. Projenin amacı**

AirTap’in amacı sıradan bir kamera filtresi yapmak değildir. Kullanıcı yalnızca yüzüne veya eline otomatik bir efekt eklenmesini izlemeyecek; efekti kendi hareketleriyle seçecek, yönetecek ve fırlatacaktır. Böylece uygulama kullanıcıya gerçek bir güç kullanıyormuş hissi verir.

Ana amaçlar:

\- Kamerayı bir oyun ve eğlence alanına dönüştürmek
\- Menüleri fiziksel dokunma olmadan el hareketleriyle kontrol etmek
\- Kullanıcıya anında ve tatmin edici görsel geri bildirim vermek
\- Kısa, komik ve paylaşılabilir videolar oluşturmak
\- Telefon ve bilgisayarda kolay kullanılmak
\- Daha sonra oyun, görüntülü görüşme ve karşılıklı efekt özelliklerine genişleyebilmek

**---**

**## 5. Hedef kullanıcılar**

\- Eğlenceli kamera filtrelerini seven gençler
\- Sosyal medya için kısa video üreten kullanıcılar
\- Ellerini kullanarak oyun oynamayı seven kişiler
\- Yeni teknoloji ve artırılmış gerçeklik uygulamalarını deneyenler
\- Arkadaşlarıyla komik içerik üretmek isteyenler
\- Kamera karşısında hareket tabanlı mini oyun oynamak isteyenler

İlk sürüm özellikle 13 yaş ve üzeri kullanıcıların kolayca anlayabileceği sade bir yapıda olmalıdır. Uygulama çocukların da ilgisini çekebileceği için içerikler şiddetli, korkutucu veya gerçekçi yaralanma görüntüleri içermemelidir.

**---**

**## 6. AirTap’in temel kullanıcı deneyimi**

**### 6.1 İlk açılış**

Kullanıcı siteye ilk kez girdiğinde sade bir karşılama ekranı görür:

\- AirTap logosu
\- “Havaya dokun, gücünü seç.” sloganı
\- Kısa tanıtım animasyonu
\- “Kamerayı Başlat” butonu
\- “Nasıl Çalışır?” butonu
\- Gizlilik bilgisi: “Kamera görüntün cihazında işlenir.”

Kullanıcı “Kamerayı Başlat” butonuna bastığında tarayıcı kamera izni ister. İzin verilmeden kamera başlatılmaz.

**### 6.2 İzin sonrası**

Kamera açılınca uygulama şunları kontrol eder:

\- Kamera görüntüsü geliyor mu?
\- En az bir el algılanıyor mu?
\- Görüntü yeterince aydınlık mı?
\- El kameraya çok yakın veya çok uzak mı?
\- Cihazın performansı yeterli mi?

Sorun varsa ekranda kısa ve anlaşılır yönlendirme gösterilir. Örneğin:

\- “Elini biraz geriye götür.”
\- “Ortam çok karanlık, ışığı artır.”
\- “Elinin tamamını kameraya göster.”
\- “Kamera izni kapalı. Tarayıcı ayarlarından izin ver.”

**### 6.3 İlk eğitim**

İlk kullanımdaki eğitim en fazla 30–45 saniye sürmelidir:

1\. Elini kameraya göster.
2\. Yalnızca işaret parmağını kaldır.
3\. Açılan çarktan bir efektin üzerine gel.
4\. Parmağınla havada iki kez dokun.
5\. Açık avucunu göster.
6\. Elini hızlıca kameraya doğru it.

Kullanıcı her aşamayı doğru yaptığında yeşil onay işareti ve hafif bir başarı sesi duyulur.

**---**

**## 7. Kamera sistemi**

**### 7.1 Kamera başlatma**

\- Kamera yalnızca kullanıcının açık izniyle başlatılmalıdır.
\- Bilgisayarda varsayılan kamera kullanılmalıdır.
\- Telefonda varsayılan olarak ön kamera açılmalıdır.
\- Kullanıcı isterse ön ve arka kamera arasında geçiş yapabilmelidir.
\- Ön kamera görüntüsü varsayılan olarak ayna şeklinde gösterilmelidir; böylece hareketler kullanıcıya doğal gelir.
\- Kaydedilen videoda ayna görüntüsünün korunması veya gerçek yönün kullanılması ayarlardan seçilebilmelidir.

**### 7.2 Kamera çözünürlüğü**

\- Normal cihazlarda hedef çözünürlük 1280×720 olmalıdır.
\- Düşük performanslı cihazlarda 640×480 kullanılabilmelidir.
\- Kamera çözünürlüğü düşse bile efekt katmanı ekranı tamamen kaplamalıdır.
\- Kamera oranı bozulmamalı; görüntü gerilmemelidir.

**### 7.3 Kamera kapatma**

\- Kullanıcı çıkış veya kamera kapatma butonuna bastığında kamera akışı tamamen durdurulmalıdır.
\- Sekme arka plana geçtiğinde performans için analiz yavaşlatılabilir.
\- Kullanıcı sayfayı kapattığında hiçbir kayıt arka planda devam etmemelidir.

**---**

**## 8. El ve parmak algılama sistemi**

Uygulama her karede elin temel noktalarını algılar. Her el için bilek, parmak eklemleri ve parmak uçları dâhil 21 işaret noktası takip edilir.

Takip edilmesi gereken temel bilgiler:

\- Bileğin konumu
\- Avuç merkezinin konumu
\- İşaret parmağının ucu
\- Başparmak ucu
\- Orta, yüzük ve serçe parmak uçları
\- Parmakların açık veya kapalı olması
\- Elin ekrandaki büyüklüğü
\- Elin yaklaşık derinliği
\- Elin hareket hızı
\- Sağ veya sol el oluşu
\- Elin kameraya dönük olup olmadığı

Titremeyi azaltmak için ham koordinatlar doğrudan kullanılmamalıdır. Koordinatlara yumuşatma uygulanmalı, fakat gecikme hissi oluşturacak kadar ağır filtre kullanılmamalıdır.

**### 8.1 El algılama göstergesi**

\- El bulunamadığında: “El bekleniyor”
\- El bulunduğunda: “El algılandı”
\- Hareket hazır olduğunda: “Hazır”
\- Atış algılandığında: Kısa parlama ve titreşim

Geliştirici modu kapalıyken eldeki 21 nokta kullanıcıya gösterilmemelidir. Bunun yerine avuç çevresinde zarif bir ışık veya küçük nişangâh bulunmalıdır.

**---**

**## 9. Tek işaret parmağı hareketinin tanımı**

Efekt menüsünü açmak için şu koşullar birlikte gerçekleşmelidir:

\- İşaret parmağı açık olmalıdır.
\- Orta parmak kapalı olmalıdır.
\- Yüzük parmağı kapalı olmalıdır.
\- Serçe parmak kapalı olmalıdır.
\- Başparmak doğal konumda olabilir; zorunlu bir açık/kapalı şartı uygulanmamalıdır.
\- El en az yaklaşık 400–500 milisaniye bu pozda kalmalıdır.
\- El ekranın kullanılabilir alanı içinde olmalıdır.

Bu koşullar sağlandığında parmağın etrafında küçük bir halka dolar. Halka tamamlanınca efekt çarkı açılır. Böylece kullanıcı yalnızca elini düzeltirken menü yanlışlıkla açılmaz.

Menü açıkken parmak kaybolursa veya el pozu bozulursa menü hemen kapanmamalıdır. Yaklaşık 500 milisaniyelik kısa bir tolerans süresi verilmelidir. El tekrar bulunamazsa menü kapanır.

**---**

**## 10. Efekt çarkı**

**### 10.1 Görünüm**

Efekt çarkı işaret parmağının çevresinde veya ekranın uygun bir merkez noktasında açılır. Telefon ekranında parmak kenara çok yakınsa çark ekran dışına taşmamalı ve otomatik olarak içeri kaydırılmalıdır.

Çarkın ilk sürümünde altı bölüm bulunur:

1\. Örümcek ağı
2\. Alev topu
3\. Buz ışını
4\. Elektrik
5\. Lazer
6\. Enerji topu

Her bölümde:

\- Efektin simgesi
\- Efektin rengi
\- Kısa adı
\- Seçildiğinde büyüyen ışıklı çerçeve

bulunmalıdır.

**### 10.2 Seçenek üzerinde gezinme**

\- Kullanıcı işaret parmağını hareket ettirerek seçenekler arasında dolaşır.
\- Parmak hangi bölümün üzerindeyse o bölüm yaklaşık %10–15 büyür.
\- Seçeneğin adı çarkın ortasında gösterilir.
\- Kısa bir ses veya titreşim geri bildirimi verilebilir.
\- Parmağın küçük titremeleri nedeniyle seçim sürekli değişmemelidir; bölüm sınırlarında tolerans alanı kullanılmalıdır.

**### 10.3 Seçim öncesi bekleme**

Kullanıcının yanlışlıkla efekt seçmemesi için parmak bir seçeneğin üzerinde yaklaşık 250–400 milisaniye kalmalıdır. Bu sırada seçeneğin çevresinde ilerleme halkası dolar. Halka dolduğunda seçenek “seçime hazır” durumuna gelir.

**---**

**## 11. Havada çift dokunma hareketi**

**### 11.1 Hareketin kullanıcı açısından tanımı**

Kullanıcı işaret parmağını seçmek istediği efektin üzerinde tutar. Ardından parmağını gerçek bir düğmeye iki kez basıyormuş gibi kameraya doğru iki küçük hareketle iter ve geri çeker:

\- İleri
\- Geri
\- İleri
\- Geri

Bu hareket yaklaşık bir saniye içinde tamamlanmalıdır.

**### 11.2 Teknik algılama mantığı**

Standart web kameraları gerçek derinliği kusursuz ölçemediği için sistem birkaç veriyi birlikte değerlendirmelidir:

\- İşaret parmağının tahmini derinlik değişimi
\- Parmak ile kamera arasındaki yaklaşma hareketi
\- İşaret parmağının ekrandaki büyüklük değişimi
\- Elin tamamının büyüyüp büyümediği
\- Hareketin hızı ve süresi
\- İki ileri hareket arasında parmağın geri dönmesi

Çift dokunma şu durumda geçerli kabul edilir:

1\. Kullanıcı seçeneğin üzerinde ve seçim hazır durumundadır.
2\. İlk ileri hareket eşik değerini geçer.
3\. Parmak kısa sürede başlangıç bölgesine geri döner.
4\. İkinci ileri hareket yaklaşık 900 milisaniye içinde gerçekleşir.
5\. Parmağın seçili çark bölümünden çok uzaklaşmaması gerekir.

Algılama eşikleri sabit piksel yerine el büyüklüğüne göre oranlanmalıdır. Böylece kamera uzaklığı değişse bile sistem çalışır.

**### 11.3 Yanlış algılamayı önleme**

\- Parmağın yalnızca yatay hareketi dokunma sayılmamalıdır.
\- El titremesi ileri dokunma olarak kabul edilmemelidir.
\- İki dokunma arasında belirgin geri dönüş olmalıdır.
\- Çok yavaş hareketler çift dokunma sayılmamalıdır.
\- Menü açıldıktan sonraki ilk 300 milisaniyede seçim yapılmamalıdır.
\- Seçim tamamlandıktan sonra yaklaşık 500 milisaniye boyunca yeni seçim engellenmelidir.

**### 11.4 Yedek seçim yöntemleri**

Kamera veya ışık koşulları çift dokunmayı doğru algılamazsa kullanıcı çaresiz kalmamalıdır. Ayarlardan şu yedek yöntemler açılabilir:

\- Başparmak ile işaret parmağını iki kez birleştirme
\- Seçenek üzerinde bir saniye bekleme
\- Ekrana veya fareyle seçeneğe dokunma

Varsayılan ve uygulamanın asıl yöntemi havada çift dokunmadır.

**---**

**## 12. Efekt seçiminin tamamlanması**

Efekt başarıyla seçildiğinde:

\- Çarkın seçilen bölümü parlar.
\- Seçilen efekt simgesi çarkın merkezine gelir.
\- Kısa bir seçim sesi çalar.
\- “Alev Topu seçildi” gibi bildirim görünür.
\- Menü küçülerek kapanır.
\- Sağ veya sol alt köşede seçili efekt simgesi kalır.
\- Seçim, kullanıcı değiştirene kadar korunur.

Seçilen efekt sayfa yenilendiğinde de hatırlanabilir. Bunun için cihazdaki yerel depolama kullanılabilir. Kullanıcı ayarlardan “Son efekti hatırla” seçeneğini kapatabilmelidir.

Efekti değiştirmek için kullanıcı yeniden yalnızca işaret parmağını kaldırır ve aynı seçim işlemini tekrarlar.

**---**

**## 13. Atış hareketi**

**### 13.1 Varsayılan atış pozu**

Efekt seçildikten sonra kullanıcı açık avucunu kameraya gösterir. Sistem avucun açık olduğunu anladığında avuç merkezinde hafif bir enerji halkası belirir. Bu, sistemin atışa hazır olduğunu gösterir.

Atış için:

1\. Açık avuç kameraya gösterilir.
2\. Avuç en az 150–250 milisaniye algılanır.
3\. Kullanıcı elini hızlı şekilde kameraya doğru iter.
4\. Uygulama ileri itme hareketini algılar.
5\. Seçili efekt avuç merkezinden fırlar.

**### 13.2 İleri itme algılama**

Sistem şu verileri birlikte değerlendirmelidir:

\- Avucun ekranda kısa sürede büyümesi
\- Bilek ve avuç merkezinin tahmini derinlik değişimi
\- Hareket hızı
\- Elin açık kalması
\- Elin önce hazır pozunda bulunması
\- İleri hareketten sonra elin geri dönmesi

Tek bir karede oluşan sıçrama atış sayılmamalıdır. Hareket birkaç ardışık karede doğrulanmalıdır.

**### 13.3 Atış durumları**

Atış sistemi bir durum makinesiyle yönetilmelidir:

\- **\*\*EL\_YOK:\*\*** Elde veri yoktur.
\- **\*\*HAZIRLANIYOR:\*\*** Açık avuç algılanmıştır.
\- **\*\*HAZIR:\*\*** Avuç yeterince sabit tutulmuştur.
\- **\*\*İLERİ\_HAREKET:\*\*** El kameraya doğru hızla yaklaşmaktadır.
\- **\*\*ATEŞLENDİ:\*\*** Efekt oluşturulmuştur.
\- **\*\*BEKLEME:\*\*** Aynı hareketin birden fazla atış üretmesi engellenir.
\- **\*\*SIFIRLAMA:\*\*** El başlangıç uzaklığına dönünce tekrar hazır olunur.

Atıştan sonra yaklaşık 500–700 milisaniyelik bekleme süresi olmalıdır. Kullanıcı elini geri çekmeden sürekli efekt çıkmamalıdır.

**### 13.4 Atışın başlangıç ve yön noktası**

\- Efektin çıkış noktası avuç merkezi olmalıdır.
\- Avuç merkezi bilek ve parmak köklerinin ortalamasından hesaplanmalıdır.
\- Atış yönü elin yönüne göre belirlenmelidir.
\- Yön hesaplanamıyorsa efekt avuçtan ekranın merkezine veya kullanıcının işaret ettiği hedefe doğru gitmelidir.
\- Ön kamera aynalıysa hesaplamalar ile görünen efekt yönü birbiriyle uyumlu olmalıdır.

**---**

**## 14. İlk efekt paketi**

**### 14.1 Örümcek Ağı**

\- Renk: Beyaz, açık gri ve hafif mavi parlama
\- Çıkış: Avuç veya bilekten ince ağ ipliği
\- Uçuş: Dalgalanan hızlı çizgi
\- Çarpma: Ekranda veya hedefte açılan ağ şekli
\- Ses: Kısa “fışşt” sesi
\- Ek özellik: Ağ çarptığı yerde kısa süre kalır, sonra çözülerek kaybolur

**### 14.2 Alev Topu**

\- Renk: Turuncu, kırmızı ve sarı
\- Çıkış: Avuçta küçük alev çekirdeği
\- Uçuş: Arkasında kıvılcım ve duman izi
\- Çarpma: Çizgi film tarzı yuvarlak patlama
\- Ses: Güçlü fakat rahatsız etmeyen ateş sesi
\- Güvenlik: Gerçekçi yanma veya yaralanma görüntüsü kullanılmaz

**### 14.3 Buz Işını**

\- Renk: Açık mavi, beyaz ve cam mavisi
\- Çıkış: Avuçtan ince soğuk ışın
\- Uçuş: Kar tanecikleri ve buz parçaları
\- Çarpma: Hedefin çevresinde buz kaplaması
\- Ses: Kristal ve donma sesi

**### 14.4 Elektrik**

\- Renk: Mor, mavi ve beyaz
\- Çıkış: Avuç çevresinde küçük elektrik kıvılcımları
\- Uçuş: Düz olmayan kırık yıldırım çizgileri
\- Çarpma: Kısa elektrik patlaması ve ekran parlaması
\- Ses: Elektrik çatırdaması

**### 14.5 Lazer**

\- Renk: Kullanıcının seçebileceği kırmızı, yeşil veya mavi
\- Çıkış: Avuç merkezinden ince ışık çizgisi
\- Uçuş: Çok hızlı ve düz
\- Çarpma: Küçük ışık halkası
\- Ses: Kısa bilim kurgu lazer sesi

**### 14.6 Enerji Topu**

\- Renk: Neon mor ve camgöbeği
\- Çıkış: Avuç içinde dönen enerji küresi
\- Uçuş: Arkasında enerji halkaları
\- Çarpma: Genişleyen ışık dalgası
\- Ses: Derin fakat kısa enerji sesi

**### 14.7 Eğlenceli efektler — sonraki paket**

\- Kalp yağmuru
\- Emoji fırlatma
\- Konfeti
\- Su balonu
\- Sabun köpüğü
\- Muz veya tavuk gibi mizahi nesneler
\- Gökkuşağı ışını

Bu efektler uygulamanın yalnızca savaş temalı görünmesini engeller ve daha geniş bir kullanıcı kitlesine hitap eder.

**---**

**## 15. Görsel efekt sistemi**

\- Kamera görüntüsü en altta bulunmalıdır.
\- El takip ve arayüz katmanı kameranın üstünde olmalıdır.
\- Efekt animasyonları en üstte ayrı bir çizim katmanında çalışmalıdır.
\- İlk sürümde performans için Canvas 2D kullanılabilir.
\- Daha gelişmiş üç boyutlu efektler sonraki sürümde WebGL veya Three.js ile yapılabilir.
\- Efektler ekran boyutuna göre ölçeklenmelidir.
\- Telefon döndürüldüğünde efekt konumları bozulmamalıdır.
\- Birden fazla parçacık kullanıldığında eski parçacıklar zamanında temizlenmelidir.
\- Düşük performans modunda parçacık sayısı, gölgeler ve ışık parlamaları azaltılmalıdır.

Efekt çıktığında şu küçük geri bildirimler kullanılabilir:

\- Çok hafif kamera sarsıntısı
\- Avuçta kısa parlama
\- Ekranın kenarlarında renk yansıması
\- Destekleyen telefonlarda kısa titreşim
\- Çizgi roman tarzı “FİŞŞT!”, “ZAP!” veya “BOOM!” yazıları

Ekran sarsıntısı ve parlama kullanıcı tarafından kapatılabilmelidir.

**---**

**## 16. Ses sistemi**

\- Her efektin ayrı seçim, hazırlanma, fırlatma ve çarpma sesi olabilir.
\- Sesler üst üste binip rahatsız edici olmamalıdır.
\- Ana ses seviyesi ve efekt ses seviyesi ayrı ayarlanabilmelidir.
\- Sessiz mod bulunmalıdır.
\- İlk kullanıcı etkileşimi gerçekleşmeden tarayıcı otomatik ses başlatmamalıdır.
\- Video kaydı yapılırken efekt seslerinin kayda eklenmesi hedeflenmelidir.
\- Kullanıcı isterse kendi mikrofon sesini kayda dâhil edebilmelidir.

**---**

**## 17. Ana ekran tasarımı**

**### 17.1 Üst bölüm**

\- AirTap logosu
\- Slogan
\- Kısa açıklama: “Elini kameraya göster, havada efektini seç ve gücünü fırlat.”
\- Büyük “Kamerayı Başlat” butonu
\- Küçük “Nasıl çalışır?” bağlantısı

**### 17.2 Tanıtım bölümü**

Üç kısa adım kartı:

1\. **\*\*Göster:\*\*** İşaret parmağını kaldır.
2\. **\*\*Seç:\*\*** Efektin üzerinde havada iki kez dokun.
3\. **\*\*Fırlat:\*\*** Avucunu ileri it.

**### 17.3 Gizlilik bölümü**

“Kamera görüntün iznin olmadan açılmaz. İlk sürümde el algılama işlemleri cihazında yapılır ve görüntün sunucuya gönderilmez.”

**### 17.4 Alt bölüm**

\- Hakkında
\- Gizlilik
\- Kullanım koşulları
\- Geri bildirim
\- Dil seçimi

**---**

**## 18. Kamera çalışma ekranı**

Kamera ekranı mümkün olduğunca geniş olmalı ve kullanıcıyı gereksiz panellerle boğmamalıdır.

**### Üst çubuk**

\- AirTap küçük logosu
\- El algılama durumu
\- FPS/performance göstergesi yalnızca geliştirici modunda
\- Ayarlar butonu
\- Kamera kapatma butonu

**### Sol veya alt alan**

\- Seçili efekt simgesi
\- Efekt adı
\- Efekt değiştirme ipucu

**### Alt orta alan**

\- Video kayıt butonu
\- Fotoğraf çekme butonu
\- Kamera değiştirme butonu
\- Mikrofon aç/kapat

**### Kamera üzerindeki dinamik öğeler**

\- Avuç merkezindeki hazır halkası
\- İşaret parmağı çevresindeki menü açma halkası
\- Efekt çarkı
\- Bildirimler
\- Efekt animasyonları
\- Eğitim yönlendirmeleri

Kontroller birkaç saniye kullanılmadığında saydamlaşabilir; kullanıcı ekrana dokunduğunda veya fareyi hareket ettirdiğinde tekrar görünür.

**---**

**## 19. Kalibrasyon sistemi**

Her kamera, ışık ve el farklı olduğu için isteğe bağlı kısa kalibrasyon bulunmalıdır.

Kalibrasyon adımları:

1\. Elini normal kullanım uzaklığında tut.
2\. Açık avucunu iki saniye göster.
3\. Elini yavaşça kameraya yaklaştır ve geri götür.
4\. Sadece işaret parmağını kaldır.
5\. Havada iki deneme dokunuşu yap.
6\. Uygulama kişiye uygun hareket eşiklerini belirlesin.

Kalibrasyon yaklaşık 10–15 saniye sürmelidir. Sonuç cihazda saklanabilir. Kullanıcı ayarlardan yeniden kalibrasyon yapabilmelidir.

Kalibrasyon atlanabilir; bu durumda güvenli varsayılan değerler kullanılmalıdır.

**---**

**## 20. Ayarlar**

**### Genel**

\- Türkçe / İngilizce
\- Açık / koyu arayüz; varsayılan koyu
\- Tam ekran
\- Eğitim ipuçlarını göster
\- Son efekti hatırla

**### Kamera**

\- Ön / arka kamera
\- Kamera seçme
\- Aynalama aç/kapat
\- 720p / düşük performans
\- El takibi hassasiyeti
\- Sağ el / sol el / otomatik

**### Hareketler**

\- Menü açma bekleme süresi
\- Havada çift dokunma hassasiyeti
\- İleri itme hassasiyeti
\- Yedek seçim yöntemi
\- Yeniden kalibrasyon

**### Efekt**

\- Efekt kalitesi: düşük, orta, yüksek
\- Parçacık yoğunluğu
\- Ekran sarsıntısı
\- Parlama yoğunluğu
\- Çizgi roman yazıları
\- Telefon titreşimi

**### Ses**

\- Ana ses
\- Efekt sesi
\- Mikrofon
\- Sessiz mod

**### Gizlilik**

\- Kayıt izinleri
\- Cihazdaki ayarları temizle
\- Kamera ve mikrofon izinlerini nasıl kapatacağını göster

**---**

**## 21. Video ve fotoğraf kayıt sistemi**

İlk çalışan prototipte kayıt zorunlu değildir; ancak tam ürünün önemli özelliklerinden biridir.

**### Video kaydı**

\- Kayıt butonuna basınca 3 saniyelik geri sayım seçeneği
\- Kamera görüntüsü ile efektlerin birlikte kaydedilmesi
\- Mikrofonu dâhil etme seçeneği
\- Kayıt sırasında kırmızı gösterge ve süre
\- Duraklatma yerine basit başlat/durdur sistemi
\- Kayıt bitince ön izleme
\- Cihaza indirme
\- Yeniden çekme

**### Fotoğraf**

\- Kamera ve efekt katmanını tek görüntü olarak yakalama
\- Fotoğraf ön izlemesi
\- Cihaza indirme

İlk sürümde sosyal medya hesaplarına doğrudan paylaşım yerine cihazın normal paylaşım menüsü veya dosya indirme kullanılmalıdır.

**---**

**## 22. Mini oyun modu — sonraki aşama**

AirTap daha sonra kamera filtresinden hareket tabanlı bir oyuna dönüşebilir.

**### Hedef modu**

\- Kamera üzerinde balon, kutu, emoji veya çizgi film canavarları belirir.
\- Kullanıcı seçtiği efektle hedefleri vurur.
\- Doğru atış puan kazandırır.
\- Kaçan hedef can veya süre kaybettirebilir.

**### Görev örnekleri**

\- 30 saniyede 10 hedef vur.
\- Üç hedefi art arda kaçırmadan vur.
\- Yalnızca mavi hedefleri buz ışınıyla vur.
\- Hareket eden hedefi örümcek ağıyla yakala.
\- Elektrikle aynı anda iki hedefi vur.

**### Puanlama**

\- İsabet: +100
\- Hız bonusu: +25 ila +100
\- Seri atış: çarpan bonusu
\- Yanlış hedef: puan kaybı
\- Görev tamamlama: yeni efekt veya renk açma

Mini oyun ilk temel sürüm tamamlanmadan geliştirilmemelidir.

**---**

**## 23. Görsel kimlik**

**### Logo fikri**

\- “AirTap” kelimesi sade ve modern yazılmalıdır.
\- “A” harfi hava hareketini temsil eden açık bir çizgiye sahip olabilir.
\- “T” harfinin üzerinde küçük bir dokunma halkası bulunabilir.
\- Logoda parmak veya el simgesi çok karmaşık kullanılmamalıdır.

**### Renk paleti**

\- Ana arka plan: \`#090B18\`
\- İkinci arka plan: \`#11162A\`
\- Neon mor: \`#8B5CF6\`
\- Camgöbeği: \`#22D3EE\`
\- Elektrik mavisi: \`#3B82F6\`
\- Beyaz metin: \`#F8FAFC\`
\- İkincil metin: \`#A7B0C5\`
\- Başarı yeşili: \`#34D399\`
\- Uyarı turuncusu: \`#F59E0B\`
\- Hata kırmızısı: \`#F87171\`

**### Yazı stili**

\- Modern, yuvarlak ve kolay okunan bir yazı tipi
\- Başlıklarda güçlü fakat aşırı oyunlaştırılmış olmayan stil
\- Küçük metinlerde yüksek okunabilirlik

**### Tasarım hissi**

\- Teknolojik
\- Eğlenceli
\- Enerjik
\- Karanlık arka plan üzerinde neon ışıklar
\- Gereksiz kalabalıktan uzak
\- Telefon ve bilgisayarda aynı marka hissi

**---**

**## 24. Erişilebilirlik**

\- Bütün önemli butonların yazılı etiketi olmalıdır.
\- Yalnızca renkle anlam verilmemelidir.
\- Metin ve arka plan arasında yeterli kontrast bulunmalıdır.
\- Hareket azaltma seçeneği olmalıdır.
\- Parlama hassasiyeti olan kullanıcılar için yoğun flaş kullanılmamalıdır.
\- El hareketlerini yapamayan kullanıcılar için dokunmatik/fareli yedek kontrol bulunmalıdır.
\- Sol el ve sağ el eşit şekilde desteklenmelidir.
\- Eğitim adımları ses olmadan da anlaşılmalıdır.
\- Hata mesajları teknik kodlar yerine açık Türkçe ile yazılmalıdır.

**---**

**## 25. Gizlilik ve güvenlik**

\- Kamera yalnızca kullanıcı butona basıp izin verdikten sonra açılmalıdır.
\- Kamera görüntüsü ilk sürümde cihaz üzerinde işlenmelidir.
\- Kullanıcı açıkça kayıt başlatmadıkça görüntü kaydedilmemelidir.
\- Kayıt başladığında ekranda görünür kırmızı işaret olmalıdır.
\- Kullanıcı kayıt dosyasını kendisi indirmelidir.
\- Uygulama gereksiz kişisel bilgi istememelidir.
\- İlk sürümde üyelik ve hesap zorunlu olmamalıdır.
\- Ayarlar ve kalibrasyon yalnızca cihazda saklanmalıdır.
\- Kamera kapatıldığında medya akışındaki bütün kamera izleri durdurulmalıdır.
\- Kullanıcıya kamera ve mikrofon izinlerini geri çekme yolu anlatılmalıdır.

Gelecekte sunucuya kayıt yükleme özelliği eklenirse ayrı açık izin, silme sistemi, saklama süresi ve güvenlik denetimi gerekecektir.

**---**

**## 26. Teknik yapı**

**### Önerilen ön yüz teknolojileri**

\- React
\- TypeScript
\- Vite
\- MediaPipe Tasks Vision veya uygun bir el takip kütüphanesi
\- Canvas 2D
\- İleri düzey efektler için daha sonra Three.js/WebGL
\- Web Audio API
\- Video için MediaRecorder API
\- Ayarlar için localStorage veya IndexedDB

**### Sunucu ihtiyacı**

İlk sürümde sunucu veya veri tabanı zorunlu değildir. El algılama, efekt seçimi, animasyon ve ayarlar cihazda çalışabilir.

Sunucu ancak şu özellikler eklenirse gerekir:

\- Üyelik
\- Bulut kayıtları
\- Kullanıcı profili
\- Efekt mağazası
\- Arkadaş sistemi
\- Görüntülü görüşme
\- Skor tablosu
\- Satın alma

**### Tarayıcı koşulları**

\- Kamera erişimi genellikle güvenli bağlantıda veya \`localhost\` üzerinde çalıştırılmalıdır.
\- Bilgisayarda güncel Chrome, Edge, Firefox ve Safari hedeflenmelidir.
\- Telefonda güncel Chrome ve Safari hedeflenmelidir.
\- Kamera veya kullanılan özellik desteklenmiyorsa uygulama açıklayıcı mesaj vermelidir.

**---**

**## 27. Önerilen proje klasör yapısı**

\`\`\`text
AirTap/
├── public/
│   ├── icons/
│   ├── sounds/
│   ├── models/
│   └── manifest.webmanifest
├── src/
│   ├── components/
│   │   ├── CameraView\.tsx
│   │   ├── EffectWheel.tsx
│   │   ├── SelectedEffect.tsx
│   │   ├── PermissionScreen.tsx
│   │   ├── CalibrationWizard.tsx
│   │   ├── TutorialOverlay.tsx
│   │   ├── RecordingControls.tsx
│   │   └── SettingsPanel.tsx
│   ├── handTracking/
│   │   ├── handTracker.ts
│   │   ├── landmarks.ts
│   │   ├── smoothing.ts
│   │   └── handState.ts
│   ├── gestures/
│   │   ├── singleFingerGesture.ts
│   │   ├── airDoubleTap.ts
│   │   ├── openPalm.ts
│   │   ├── forwardPush.ts
│   │   └── gestureStateMachine.ts
│   ├── effects/
│   │   ├── effectEngine.ts
│   │   ├── webEffect.ts
│   │   ├── fireballEffect.ts
│   │   ├── iceEffect.ts
│   │   ├── lightningEffect.ts
│   │   ├── laserEffect.ts
│   │   └── energyEffect.ts
│   ├── audio/
│   │   └── audioManager.ts
│   ├── recording/
│   │   └── recorder.ts
│   ├── settings/
│   │   ├── defaults.ts
│   │   └── storage.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── CameraPage.tsx
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── tests/
├── index.html
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

**---**

**## 28. Uygulama durumları**

Uygulamanın ana durumu net şekilde yönetilmelidir:

\- \`WELCOME\`: Karşılama ekranı
\- \`REQUESTING\_PERMISSION\`: Kamera izni bekleniyor
\- \`CAMERA\_ERROR\`: Kamera açılamadı
\- \`CALIBRATION\`: Kalibrasyon yapılıyor
\- \`TUTORIAL\`: İlk kullanım eğitimi
\- \`TRACKING\`: El takip ediliyor
\- \`EFFECT\_MENU\_OPEN\`: Efekt çarkı açık
\- \`EFFECT\_SELECTED\`: Efekt seçildi
\- \`READY\_TO\_FIRE\`: Açık avuç atışa hazır
\- \`FIRING\`: Efekt fırlatılıyor
\- \`RECORDING\`: Video kaydı yapılıyor
\- \`PAUSED\`: Kamera veya analiz geçici durdu

Efekt menüsü açıkken atış yapılmamalı; atış sırasında menü açılmamalıdır. Bu durumların birbirine karışması engellenmelidir.

**---**

**## 29. Hata durumları ve kullanıcı mesajları**

**### Kamera izni reddedildi**

“AirTap’in elini görebilmesi için kamera izni gerekiyor. Tarayıcı ayarlarından izni açıp tekrar deneyebilirsin.”

**### Kamera bulunamadı**

“Bu cihazda kullanılabilir bir kamera bulunamadı.”

**### Kamera başka uygulamada**

“Kamera başka bir uygulama tarafından kullanılıyor olabilir. Diğer uygulamayı kapatıp tekrar dene.”

**### El algılanmıyor**

“Elinin tamamını kameraya göster ve biraz daha aydınlık bir yere geç.”

**### Performans düşük**

“Cihazın zorlanıyor. Daha akıcı kullanım için düşük efekt kalitesine geçebilirsin.”

**### Kayıt başarısız**

“Video kaydı oluşturulamadı. Tarayıcı desteğini veya boş depolama alanını kontrol et.”

**### Desteklenmeyen tarayıcı**

“Bu özellik tarayıcında desteklenmiyor. Güncel Chrome, Edge veya Safari ile tekrar deneyebilirsin.”

**---**

**## 30. Performans hedefleri**

\- El takip görüntüsü mümkün olduğunca akıcı olmalıdır.
\- Orta seviye cihazlarda hedef en az yaklaşık 24–30 FPS olmalıdır.
\- El hareketi ile ekrandaki tepki arasında fark edilir uzun gecikme olmamalıdır.
\- Efekt seçimi doğru harekette hızlı onaylanmalıdır.
\- El geçici kaybolduğunda arayüz titrememelidir.
\- Düşük performans modu otomatik önerilebilmelidir.
\- Kullanılmayan sesler ve efekt parçacıkları bellekten temizlenmelidir.
\- Sekme görünmez olduğunda ağır analiz azaltılmalıdır.

**---**

**## 31. İlk sürüm — MVP kapsamı**

İlk çalışan sürümde yalnızca şu özellikler bulunmalıdır:

1\. AirTap karşılama ekranı
2\. Kamera izni ve kamera başlatma
3\. Ön kamera ve ayna görüntüsü
4\. Tek el algılama
5\. İşaret parmağı açık pozunu algılama
6\. Altı seçenekli efekt çarkı
7\. Parmağın seçenek üzerinde hareket etmesi
8\. Havada çift dokunma algılama
9\. Seçilen efektin ekranda gösterilmesi
10\. Açık avuç algılama
11\. Eli ileri itme algılama
12\. Seçilen efekti avuçtan fırlatma
13\. Atış bekleme ve sıfırlama sistemi
14\. Temel sesler
15\. Kamera kapatma
16\. Hassasiyet ve ses ayarları
17\. Mobil ve bilgisayar uyumu
18\. Açıklayıcı hata mesajları

İlk MVP’de üyelik, veri tabanı, görüntülü görüşme, mağaza ve çok oyunculu özellik bulunmamalıdır.

**---**

**## 32. Geliştirme sırası**

**### Aşama 1 — Kamera temeli**

\- Proje yapısını oluştur
\- Kamera izni al
\- Kamera görüntüsünü doğru oranla göster
\- Ön/arka kamera değişimini yap
\- Kamera kapatmayı güvenli hâle getir

**### Aşama 2 — El takibi**

\- El takip modelini ekle
\- 21 el noktasını al
\- Avuç merkezini hesapla
\- Sağ/sol el ayrımını yap
\- Koordinat yumuşatma ekle

**### Aşama 3 — Menü hareketi**

\- Tek işaret parmağı pozunu algıla
\- Bekleme halkasını yap
\- Efekt çarkını aç
\- Parmakla seçenek üzerinde gezinmeyi yap

**### Aşama 4 — Havada çift dokunma**

\- Derinlik ve büyüklük verilerini işle
\- Bir ileri-geri hareketi algıla
\- İki hareketi zaman aralığıyla doğrula
\- Yanlış seçimleri azalt
\- Yedek seçim yöntemini ekle

**### Aşama 5 — Atış sistemi**

\- Açık avucu algıla
\- Hazır durumunu göster
\- İleri itme hareketini algıla
\- Bekleme ve sıfırlama sistemini kur

**### Aşama 6 — Efekt motoru**

\- Ortak efekt yapısını oluştur
\- Örümcek ağını yap
\- Alev topunu yap
\- Buz, elektrik, lazer ve enerji topunu ekle
\- Ses ve çarpma animasyonlarını ekle

**### Aşama 7 — Arayüz**

\- Ana ekran
\- Eğitim
\- Ayarlar
\- Kamera kontrolleri
\- Mobil uyum
\- Hata ekranları

**### Aşama 8 — Test ve düzeltme**

\- Farklı ışık koşulları
\- Farklı kamera uzaklıkları
\- Sağ ve sol el
\- Telefon ve bilgisayar
\- Yavaş cihazlar
\- Uzun kullanımda bellek
\- Yanlış hareket algılama

**### Aşama 9 — Kayıt**

\- Kamera ve efekt katmanını birleştir
\- Video kaydını ekle
\- Mikrofon seçeneğini ekle
\- Ön izleme ve indirmeyi yap

**---**

**## 33. Test senaryoları**

**### Temel testler**

\- Kullanıcı izin verdiğinde kamera açılıyor mu?
\- İzin reddedildiğinde doğru açıklama geliyor mu?
\- Kamera kapatıldığında kamera ışığı sönüyor mu?
\- El birkaç saniye içinde algılanıyor mu?
\- Sağ ve sol el ayrı ayrı çalışıyor mu?

**### Menü testleri**

\- Sadece işaret parmağı açıkken menü açılıyor mu?
\- Normal el hareketlerinde menü yanlışlıkla açılıyor mu?
\- Menü ekran kenarından taşmadan görünüyor mu?
\- Parmak hangi seçeneğe giderse doğru seçenek vurgulanıyor mu?
\- Çift dokunma yapılmadan seçim gerçekleşmiyor mu?
\- Doğru çift dokunmada seçim gerçekleşiyor mu?
\- Seçimden sonra menü kapanıyor mu?
\- Seçilen efekt kullanıcı değiştirene kadar korunuyor mu?

**### Atış testleri**

\- Açık avuç doğru algılanıyor mu?
\- El yavaşça yaklaşınca yanlışlıkla atış oluyor mu?
\- Hızlı ileri itmede atış oluyor mu?
\- Tek hareket yalnızca bir atış üretiyor mu?
\- El geri çekilmeden ikinci atış engelleniyor mu?
\- Efekt avuç merkezinden çıkıyor mu?
\- Aynalı kamerada yön doğru mu?

**### Performans testleri**

\- Efektler sırasında kamera donuyor mu?
\- Düşük performans modu işe yarıyor mu?
\- Uzun kullanımda uygulama yavaşlıyor mu?
\- Telefon döndürülünce arayüz düzeliyor mu?

**---**

**## 34. MVP kabul ölçütleri**

Projenin ilk sürümü ancak şu şartlar sağlanırsa tamamlanmış sayılmalıdır:

\- Kamera izin süreci anlaşılır ve sorunsuzdur.
\- El kısa sürede algılanır.
\- Tek parmak hareketi menüyü güvenilir şekilde açar.
\- Parmağın konumu menüde doğru takip edilir.
\- Havada çift dokunma çoğu normal kullanımda doğru anlaşılır.
\- Yanlış seçim oranı kullanıcıyı rahatsız edecek seviyede değildir.
\- Seçilen efekt kalıcı olarak aktif kalır.
\- Açık avuç ve ileri itme doğru ayırt edilir.
\- Her ileri itme yalnızca bir efekt üretir.
\- Efekt avuçtan çıkıyormuş gibi görünür.
\- Telefon ve bilgisayarda arayüz kullanılabilir durumdadır.
\- Kamera kapatıldığında gerçekten durur.
\- Görüntüler izinsiz kaydedilmez veya gönderilmez.

**---**

**## 35. Gelecek sürümler**

**### Sürüm 1.1**

\- Video ve fotoğraf kayıt sistemi
\- Daha fazla efekt
\- Efekt renkleri
\- Gelişmiş kalibrasyon
\- İki el algılama

**### Sürüm 1.5**

\- Hedef vurma oyunu
\- Görevler
\- Puan ve seri sistemi
\- Yeni efektlerin görevle açılması

**### Sürüm 2.0**

\- Kullanıcı hesabı
\- Profil ve efekt koleksiyonu
\- Bulut kayıtları
\- Arkadaşlarla skor karşılaştırma

**### Sürüm 3.0**

\- İki kişilik görüntülü görüşme
\- İki tarafın el hareketlerini algılama
\- Karşılıklı efekt gönderme
\- Uygunsuz el hareketini komik emojiyle kapatma
\- Küfür algılandığında sesi bip veya komik sesle değiştirme
\- Karşılıklı mini oyunlar

**---**

**## 36. Para kazanma modeli — ileride**

İlk sürüm ücretsiz olmalıdır. Kullanıcı uygulamanın temel eğlencesini ödeme yapmadan anlayabilmelidir.

İleride kullanılabilecek modeller:

\- Ücretsiz temel efektler
\- Ücretli özel efekt paketleri
\- Reklamsız premium sürüm
\- İçerik üreticileri için yüksek kalite kayıt
\- Sezonluk çizgi film ve oyun temaları
\- Özel ses paketleri
\- Kişiselleştirilmiş efekt renkleri

Kamera ekranında kullanıcının hareketini kapatacak veya yanlış dokunmaya neden olacak reklam kullanılmamalıdır.

**---**

**## 37. Projenin riskleri ve çözümleri**

**### Risk: Normal kamerada gerçek derinlik ölçümü zayıf olabilir**

**\*\*Çözüm:\*\*** Tahmini derinlik, el büyüklüğü, hareket hızı ve kalibrasyonu birlikte kullan. Yedek olarak çift parmak birleştirme veya ekrana dokunma sun.

**### Risk: El titremesi yanlış seçim yapabilir**

**\*\*Çözüm:\*\*** Koordinat yumuşatma, seçenek üzerinde bekleme ve çift hareket doğrulaması kullan.

**### Risk: Düşük cihazlarda donma olabilir**

**\*\*Çözüm:\*\*** Daha düşük kamera çözünürlüğü, daha az el analiz karesi ve düşük parçacık modu kullan.

**### Risk: Arka planla el karışabilir**

**\*\*Çözüm:\*\*** Kullanıcıyı daha aydınlık ortama yönlendir ve güven skoru düşükken işlem yapma.

**### Risk: Kullanıcı hareketleri öğrenemeyebilir**

**\*\*Çözüm:\*\*** İlk eğitim, canlı el çizimi, ilerleme halkaları ve her adımda kısa yönlendirme kullan.

**### Risk: Menü ve atış hareketleri birbirine karışabilir**

**\*\*Çözüm:\*\*** Tek parmak menü durumunda atışı; açık avuç atış durumunda menüyü devre dışı bırak.

**---**

**## 38. AirTap’i farklı yapan özellikler**

\- Efektler ekrandaki normal düğmelerden değil, havada parmakla seçilir.
\- Seçim için havada çift dokunma kullanılır.
\- Seçilen güç, kullanıcı değiştirene kadar aktif kalır.
\- Efektler rastgele değil, gerçek ileri itme hareketiyle fırlatılır.
\- Kamera filtresi, hareket kontrolü ve oyun hissi tek projede birleşir.
\- Sistem yalnızca ciddi güçler değil, komik efektler de sunabilir.
\- İleride görüntülü konuşma ve karşılıklı efekt sistemine genişleyebilir.

**---**

**## 39. Tek cümlelik tanıtım**

**\*\*AirTap, işaret parmağınla havada efekt seçip avucunu ileri iterek seçtiğin gücü kamerada fırlatmanı sağlayan hareket kontrollü eğlence uygulamasıdır.\*\***

**---**

**## 40. Kısa tanıtım metni**

AirTap ile ekranına dokunmadan gücünü seç. İşaret parmağını kaldır, açılan efekt çarkında istediğin gücün üzerine gel ve havada iki kez dokun. Ardından avucunu ileri it; örümcek ağı, alev topu, buz, elektrik, lazer veya enerji topu elinden fırlasın. Kamera artık yalnızca seni göstermiyor, hareketlerini eğlenceli efektlere dönüştürüyor.

**---**

**## 41. Geliştiriciye veya yapay zekâya verilecek ana talimat**

AirTap isimli, bilgisayar ve telefon tarayıcılarında çalışan kamera tabanlı bir web uygulaması geliştir. Uygulama kullanıcının elini ve parmaklarını gerçek zamanlı algılasın. Kullanıcı yalnızca işaret parmağını kaldırıp yaklaşık yarım saniye sabit tuttuğunda, parmağının çevresinde altı seçenekli dairesel efekt menüsü açılsın. Kullanıcı parmağını hareket ettirerek Örümcek Ağı, Alev Topu, Buz Işını, Elektrik, Lazer ve Enerji Topu seçeneklerinden birinin üzerine gelebilsin. Seçenek vurgulansın ve seçim hazır hâle gelsin. Kullanıcı parmağıyla kameraya doğru iki küçük ileri-geri hareket yaparak havada çift dokunduğunda efekt seçilsin. Menü kapansın, seçilen efekt ekranda gösterilsin ve kullanıcı değiştirene kadar aktif kalsın.

Efekt seçildikten sonra kullanıcı açık avucunu kameraya gösterdiğinde avuç merkezinde hazır halkası belirsin. Kullanıcı elini hızlı şekilde kameraya doğru ittiğinde seçili efekt avuç merkezinden fırlasın. İleri itme; el büyüklüğü, tahmini derinlik ve hareket hızı birlikte değerlendirilerek algılansın. Tek hareket yalnızca bir atış oluştursun. Yeni atış için elin geri dönmesi beklensin. El koordinatları yumuşatılsın ve küçük titremeler yanlış hareket oluşturmasın.

Arayüz koyu lacivert zemin, neon mor ve camgöbeği renklerle modern, teknolojik ve eğlenceli tasarlansın. Ana ekranda AirTap logosu, “Havaya dokun, gücünü seç.” sloganı, Kamerayı Başlat ve Nasıl Çalışır butonları bulunsun. Kamera ekranında seçili efekt, kamera değiştirme, kayıt, mikrofon, ayarlar ve kamerayı kapatma kontrolleri yer alsın. Telefon ve bilgisayar ekranlarına uyumlu olsun. Kamera izni reddedildiğinde, el algılanmadığında, ortam karanlık olduğunda veya cihaz zorlandığında anlaşılır Türkçe mesajlar gösterilsin.

İlk sürümde görüntü cihaz üzerinde işlensin, üyelik ve veri tabanı olmasın, kamera izinsiz açılmasın ve kullanıcı kayıt başlatmadan görüntü kaydedilmesin. El takibi için uygun bir gerçek zamanlı el işaret noktası sistemi; efektler için Canvas 2D, sesler için Web Audio API ve daha sonra kayıt için MediaRecorder kullanılabilir. Kod modüler, okunabilir ve yeni efektler eklenebilecek yapıda hazırlanmalıdır. Önce kamera ve el takibi, sonra tek parmak menüsü, havada çift dokunma, açık avuç ve ileri itme, ardından efekt motoru ve arayüz geliştirilmelidir.

**---**

**## 42. Son karar özeti**

\- Projenin adı **\*\*AirTap\*\*** olacaktır.
\- Ana slogan **\*\*“Havaya dokun, gücünü seç.”\*\*** olacaktır.
\- İlk ürün web tarayıcısında çalışacaktır.
\- İlk kullanım tek kişi ve tek kamera olacaktır.
\- Tek işaret parmağı efekt çarkını açacaktır.
\- Efekt, parmakla üzerine gelinip havada iki kez dokunularak seçilecektir.
\- Seçilen efekt kullanıcı değiştirene kadar aktif kalacaktır.
\- Açık avuç ve ileri itme hareketi efekti fırlatacaktır.
\- İlk efektler örümcek ağı, alev topu, buz, elektrik, lazer ve enerji topu olacaktır.
\- İlk sürümde üyelik ve veri tabanı bulunmayacaktır.
\- Görüntü kullanıcının cihazında işlenecektir.
\- Proje daha sonra kayıt, mini oyun, görüntülü konuşma, komik emoji ve ses değiştirme özellikleriyle büyütülebilecektir.