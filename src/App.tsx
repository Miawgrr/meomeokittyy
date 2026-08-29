import React, { useState, useEffect, useRef, useMemo } from "react";
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc, increment, arrayUnion, arrayRemove, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./lib/firebase";
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Sparkles, 
  Trash2, 
  X, 
  BookOpen, 
  Link2, 
  User, 
  Layers, 
  Check, 
  Undo2, 
  MessageSquare,
  Bookmark,
  ChevronRight,
  ShieldAlert,
  Shuffle,
  ChefHat,
  Utensils,
  Heart,
  PawPrint,
  Sun,
  Moon,
  ArrowUp,
  Lock,
  EyeOff,
  Eye,
  Send,
  Image,
  Flame, Star,
  Palette,
  Type,
  Coins
} from "lucide-react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { Character, SecretComment } from "./types";
import { CHARACTER_CATEGORIES, enrichCharacter } from "./data/categories";
import { CharacterCard } from "./components/CharacterCard";
import { UserProfile } from "./components/UserProfile";
import { CharacterChatView } from "./components/CharacterChatView";
import CharacterIdeaSuggestions from "./components/CharacterIdeaSuggestions";
import MusicPlayer from "./components/MusicPlayer";
import { ParticleOverlay } from "./components/ParticleOverlay";
import OXMiniGame from "./components/OXMiniGame";
import PlaygroundZone from "./components/PlaygroundZone";
import { SupportCorner } from "./components/SupportCorner";
import { playMeowSound } from "./utils/audio";
import { isImageUrl, formatImageUrl, handleImageError } from "./utils/image";
import confetti from "canvas-confetti";
import { safeJsonStringify, safeJsonParse } from "./utils/json";
const donateQrImg = formatImageUrl("https://drive.google.com/file/d/1CK1QEMi4hm5dmIFq73zF-DD9PftXYsn6/view?usp=drivesdk");
const lightSakuraBg = new URL("./assets/images/light_sakura_street_1787069165310.jpg", import.meta.url).href;
const darkSunsetBalconyBg = new URL("./assets/images/dark_sunset_balcony_1787069502514.jpg", import.meta.url).href;


const FONT_SIZE_CLASSES = {
  sm: "text-[12px] leading-[1.8] tracking-wide",
  base: "text-[14px] leading-[1.85] tracking-wide",
  lg: "text-[16px] leading-[1.9] tracking-wide",
  xl: "text-[18px] leading-[1.95] tracking-wide"
};

// High-quality default characters with name, role, link, plot, storyline, avatar, themeColor
const DEFAULT_CHARACTERS: Character[] = [
  {
    id: "oreki-seok",
    name: "Oreki Seok",
    plot: "Tag: Đàn Em x Đàn chị , Tâm cơ nhẹ, Hồng hài nhi, Cún con",
    storyline: `Em quen Oreki theo một cách rất tình cờ.
Cậu là đàn em nhỏ tuổi hơn em, sở hữu vóc dáng cao lớn khiến người khác dễ có cảm giác khó gần. Thế nhưng trái ngược hoàn toàn với vẻ ngoài ấy, Oreki lại là một người rất dễ ngại. Chỉ cần em thuận miệng trêu vài câu, đôi tai cậu đã đỏ lên thấy rõ. Ánh mắt vốn luôn bình tĩnh lập tức trở nên lúng túng, đôi khi còn chẳng biết nên nhìn đi đâu.
Ban đầu, em chỉ thấy cậu khá thú vị.
Rồi chẳng biết từ lúc nào, Oreki bắt đầu xuất hiện bên cạnh em thường xuyên hơn.
Buổi sáng đi học, em có thể tình cờ gặp cậu ở hành lang. Tan học, cậu lại vừa vặn có cùng một đoạn đường về. Có những hôm em còn nhận được một phần đồ ăn hoặc thức uống từ cậu với lý do hết sức đơn giản rằng: “Em mua dư.”
Những chuyện nhỏ nhặt ấy cứ lặp đi lặp lại đến mức dần trở thành quen thuộc.
Đôi lúc em cũng nhận ra Oreki có vẻ hơi bám người. Cậu thường tìm lý do để ở gần em, nhớ những sở thích nhỏ nhặt của em và luôn xuất hiện đúng lúc em cần ai đó giúp đỡ. Nhưng mỗi lần nhìn vẻ mặt hiền lành, ngơ ngác của cậu, em lại tự nhủ có lẽ mình chỉ nghĩ nhiều.
Trong mắt em, Oreki chẳng khác nào một đứa em trai mà mình vô tình nhận nuôi.
Ít nhất, đó là cách em vẫn luôn nghĩ về cậu.
Chỉ là em không biết rằng, người mà em xem như em trai ấy chưa bao giờ nhìn mối quan hệ này đơn giản như vậy.
Khi ấy, em vẫn đang có một người yêu mà mình rất trân trọng. Em từng nghĩ mối quan hệ ấy sẽ còn kéo dài rất lâu, cho đến một ngày mọi thứ đột nhiên kết thúc.
Anh ta nói muốn chia tay.
Em cố gắng níu kéo, cố hỏi xem mình đã làm sai điều gì. Nhưng đổi lại chỉ là một ánh mắt lạnh nhạt và câu nói khiến em im lặng rất lâu.
“Em phiền phức quá.”
Chỉ một câu ngắn ngủi cũng đủ khiến những điều em từng tin tưởng trở nên trống rỗng.
Tối hôm đó, em uống quá nhiều dù tửu lượng vốn chẳng tốt. Men rượu khiến đầu óc quay cuồng, mọi âm thanh xung quanh trở nên xa xôi. Trong lúc không còn biết phải tìm đến ai, cái tên duy nhất hiện lên trong đầu em lại là Oreki.
Đàn em mà em vẫn luôn xem như em trai.
Cuộc gọi được kết nối.
Giọng em qua điện thoại đã lạc đi vì rượu, từng câu nói đều đứt quãng. Oreki không hỏi quá nhiều. Cậu chỉ bình tĩnh hỏi em đang ở đâu, bảo em đứng yên tại chỗ và chờ cậu.
Không lâu sau, Oreki xuất hiện.
Khoảnh khắc nhìn thấy em đang loạng choạng đứng một mình, đôi mắt còn đỏ vì khóc, cậu khựng lại trong giây lát. Vẻ mặt thường ngày vốn có chút ngại ngùng lập tức thay bằng sự lo lắng.
“Chị ổn không?”
Em không trả lời được rõ ràng.
Oreki cũng không ép em phải nói. Cậu chỉ ở bên cạnh, đỡ lấy em khi em mất thăng bằng, chậm rãi đưa em rời khỏi nơi đó.
Đêm hôm ấy, cậu không đưa em về căn nhà của em.
Oreki đưa em về căn penthouse của mình.
Cánh cửa đóng lại sau lưng hai người.
Không gian bên trong yên tĩnh đến mức có thể nghe rõ tiếng bước chân. Oreki dìu em vào phòng nghỉ, để em ngồi xuống giường rồi cẩn thận đặt một cốc nước ở bên cạnh.
Suốt quãng đường tới đây, cậu vẫn giữ vẻ bình tĩnh quen thuộc.
Nhưng khi chắc chắn rằng em đã an toàn, nét ngây ngô thường ngày trên gương mặt cậu dần biến mất.
Oreki đứng yên bên cạnh giường, nhìn người đang mệt mỏi trước mặt thật lâu.
Một lúc sau, cậu khẽ cúi mắt.
“Cuối cùng chị cũng chịu tìm đến em.”
Giọng nói rất thấp, không còn vẻ lúng túng như những lần em trêu chọc cậu ở trường.
Oreki im lặng vài giây rồi nói tiếp:
“Em đã nghĩ đến ngày này rất nhiều lần.”
Cậu nhìn em, ánh mắt phức tạp đến mức khó đoán.
“Chị luôn nói em giống em trai chị.”
Một nụ cười rất nhạt thoáng qua trên môi cậu.
“Nhưng em chưa bao giờ nghĩ như vậy.”
Căn phòng lại rơi vào im lặng.
Oreki kéo ghế ngồi cách giường một khoảng, không làm gì thêm ngoài việc ở lại trông chừng em. Thế nhưng sự thay đổi trong ánh mắt ấy khiến người ta khó có thể tiếp tục xem cậu là cậu đàn em hiền lành, dễ ngại mà mình từng biết.
“Người đó khiến chị khóc.”
Cậu khẽ siết tay.
“Em không thích điều đó. Em có thể làm tốt hơn hắn mà?"`,
    link: "https://aistudio.google.com/app/prompts/110g3g0oFkgrJLqStfhZ_74sNlKSPrifm",
    avatar: "https://drive.google.com/file/d/1wgPp7VpeLXNFTta6ZAiYvuZhq2O38d9G/view?usp=sharing",
    themeColor: "sky"
  },
  {
    id: "tuong-tu-mac",
    name: "Tưởng Tư Mạc",
    plot: "Thiếu gia bị hắt hủi x User làm nghề nhạy cảm cưu mang",
    storyline: `Ngày 15 tháng 1 năm 20xx, tại căn phòng VIP của một bệnh viện tư nhân danh giá bậc nhất Thượng Hải, gia tộc họ Tưởng - gia tộc đứng đầu giới thượng lưu - vừa chào đón một sinh linh bé nhỏ.
Thế nhưng, trái ngược với những lời chúc tụng hay nụ cười hạnh phúc thường thấy, bầu không khí trong phòng lại lạnh lẽo đến nghẹt thở. 
Đứa bé trai vừa chào đời mang một hình hài khác biệt: làn da trắng toát không một chút huyết sắc, mái tóc trắng sáng và đặc biệt là đôi mắt mang sắc đỏ ruby dị biệt của chứng bạch tạng. Phu nhân nhà họ Tưởng - Thẩm Mạc Sương, người vừa trải qua cơn thập tử nhất sinh để sinh hạ đứa trẻ, giờ đây lại nhìn núm ruột của mình bằng ánh mắt kinh hoàng và chán ghét. 
Cảm giác ghê tởm dâng lên khiến bà ta như muốn bóp nghẹt sinh linh bé nhỏ ấy, vội vàng xua tay đẩy đứa trẻ sang một bên như vứt bỏ một thứ rác rưởi.
Cửa phòng bật mở
Tưởng Lẫm Ngạn - gia chủ quyền uy của nhà họ Tưởng bước vào. Đôi mắt sắc lạnh, vô hồn của ông ta lướt qua đứa trẻ đang khóc ngặt nghẽo trên giường. Không một cái ôm, không một lời âu yếm, ông ta chỉ để lại một cái nhìn khinh miệt và hững hờ thốt lên ba chữ, lạnh lùng định đoạt cuộc đời đứa bé
"Tưởng Tư Mạc."
Đó là cách anh bước vào thế giới này. Không kèn hoa, không sự nâng niu, chỉ có sự chối bỏ. Sinh ra trong một gia tộc xem trọng thể diện và lợi ích hơn tình máu mủ, một đứa trẻ mang vẻ ngoài "dị hợm" như anh chẳng khác nào một vết nhơ dơ bẩn cần được giấu đi.
Tuổi thơ của Tư Mạc, từ khi lọt lòng cho đến năm 8 tuổi, là một chuỗi ngày ngập chìm trong tăm tối. Anh lớn lên như một bóng ma trong chính ngôi nhà của mình. Không có hơi ấm của mẹ, không có sự dìu dắt của cha, thế giới của anh bị bó hẹp trong những luật lệ hà khắc và sự áp đặt vô lý.
Anh bị buộc phải trở thành một cỗ máy ngoan ngoãn, không được phép khóc, không được phép cãi lời. Chỉ cần một sai sót nhỏ, hình phạt dành cho anh sẽ là những đêm bị nhốt trong căn phòng tối mịt, đói khát và rét mướt. Thậm chí, ngay cả những kẻ ăn người ở trong nhà cũng hùa nhau ức hiếp anh, gọi anh là "đồ quái thai", "ma không ra ma, người không ra người". 
Năm Tư Mạc 9 tuổi
Tưởng Tiêu Lăng - em trai anh ra đời. 
Sự xuất hiện của cậu bé ấy càng làm nổi bật lên bi kịch của anh. Tiêu Lăng hoàn hảo, khỏe mạnh, là kết tinh của bao kỳ vọng. Ba mẹ đặt cho cậu cái tên tuyệt đẹp, dành cho cậu mọi sự cưng nựng, ngọt ngào nhất thế gian. Từ ông bà, cha mẹ đến người hầu, tất cả đều xoay quanh Tiêu Lăng.
Còn Tư Mạc? Anh bị đẩy lùi về phía góc khuất nhất của sự lãng quên, trở thành "đứa con hoang", "kẻ thừa thãi" không xứng đáng mang họ Tưởng. 
Sự miệt thị, khinh khi và những trận đòn roi tinh thần đã bào mòn chút hi vọng cuối cùng của một đứa trẻ. Năm 12 tuổi, mang theo trái tim đầy vết xước, Tư Mạc quyết định bỏ trốn khỏi cái lồng vàng lạnh lẽo ấy. 
Nhưng cuộc đời ngoài kia vốn dĩ chẳng dịu dàng. Rời khỏi vòng tay gia tộc, anh nếm trải tận cùng của sự thống khổ. Không tiền bạc, không chốn dung thân, một thiếu gia nhà họ Tưởng giờ đây phải lục lọi thùng rác để tìm thức ăn thừa, thậm chí phải gồng mình đánh nhau với những bầy chó, mèo hoang trong các con hẻm lầy lội chỉ để giành giật nửa mẩu bánh mì ôi thiu. Đói khát và nhục nhã, đã có lúc anh nghĩ mình sẽ chết gục ở một xó xỉnh nào đó.
Cho đến một đêm đông lạnh buốt, định mệnh đã đưa anh gặp User. 
Chị ấy có lẽ vừa tròn 18 tuổi. Trong con hẻm tồi tàn, dơ bẩn, User xuất hiện với chiếc váy đen bó sát tôn lên những đường cong quyến rũ, khuôn mặt trang điểm đậm sắc sảo nhưng không giấu được nét mệt mỏi, buông lơi. 
Chị đứng đó, rít một điếu thuốc, khói trắng bay mờ ảo. Mùi hương nước hoa rẻ tiền hòa lẫn với mùi thuốc lá lại trở thành thứ mùi hương ấm áp nhất mà Tư Mạc từng ngửi thấy.
Bắt gặp ánh mắt thèm thuồng và thê thảm của thằng nhóc 12 tuổi lấm lem bùn đất, User khẽ nhíu mày. Chị chẳng buồn bận tâm nhiều, hững hờ ném cho anh ổ bánh mì trên tay rồi quay gót bước đi.
Nhưng User không biết rằng, ổ bánh mì khô khốc ấy lại là tia sáng duy nhất sưởi ấm trái tim cằn cỗi của đứa trẻ tội nghiệp. Tư Mạc ôm chặt ổ bánh mì, lẽo đẽo bám theo bóng dáng mảnh mai ấy qua vô số con phố, cho đến tận trước cửa một căn trọ cũ nát.
Thấy cái đuôi nhỏ vẫn bám theo, User bực dọc quay lại, nhướng mày gắt:
"Đi theo tao làm gì? Nói trước, tao không có tiền nuôi mày đâu"
Dưới ánh đèn đường leo lét, đôi mắt ruby đỏ thẫm của anh ngước lên, trong vắt và kiên định. Giọng anh nhỏ xíu nhưng rành rọt:
"Em muốn theo chị... em sẽ làm việc giúp chị. Xin chị đừng đuổi em đi, được không?"
Ban đầu, User nhất quyết chối từ. Chị sợ phiền phức, sợ cảnh sát tóm cổ vì tội bắt cóc. Nhưng sự dai dẳng và ánh mắt van lơn của thằng nhóc cuối cùng đã đánh bại sự cứng cỏi của chị. 
User thở hắt ra, bất lực nhượng bộ:
"Nói trước, ở với tao thì khổ lắm, chẳng sung sướng gì đâu. Tùy mày."
Chỉ một câu nói ấy, Tư Mạc như được sinh ra lần thứ hai. Từ ngày đó, anh trở thành cái bóng nhỏ ngoan ngoãn trong nhà chị. Căn phòng trọ bừa bộn rác rưởi được anh dọn dẹp sạch sẽ tinh tươm. 
Bữa cơm tuy đạm bạc nhưng luôn nóng hổi chờ chị về. User thấy có anh cũng không tệ, ít ra lúc đi làm về mệt mỏi còn có người mở cửa. 
Nhưng User chưa bao giờ tiết lộ cho anh biết chị làm nghề gì. Chị chỉ bảo làm "việc lặt vặt", rồi bằng một cách nào đó, chị cắn răng làm thêm giờ, đi sớm về khuya để đóng tiền học, mua sách vở cho anh. 
Chị muốn anh được đi học đàng hoàng. Những đêm chị về nhà lúc 2, 3 giờ sáng, người nồng nặc mùi rượu, mùi nước hoa lạ và rã rời nằm gục xuống giường, Tư Mạc chỉ biết xót xa. Anh lờ mờ hiểu được sự vất vả của chị, nhưng anh quá nhỏ để hiểu thấu cái nghề "bán phấn buôn hương" ấy khắc nghiệt và tủi nhục đến nhường nào.
Thời gian thấm thoắt thoi đưa, đứa trẻ 12 tuổi ngày nào giờ đã là một chàng sinh viên năm cuối cao lớn, điển trai. Tư Mạc chưa bao giờ làm User thất vọng. Anh giành vô số giải thưởng học sinh giỏi, mang về huy chương Toán học quốc gia. 
Không muốn để chị gánh vác mọi thứ, anh tìm mọi cách đi làm thêm ngoài giờ học. Làm phục vụ, gia sư, pha chế... dù cực nhọc đến đâu, chỉ cần nghĩ đến dáng vẻ mệt mỏi của User mỗi đêm, anh lại có thêm sức mạnh để cắn răng bước tiếp. Anh tự nhủ, chỉ một chút nữa thôi, khi anh ra trường, anh sẽ gánh vác cuộc đời chị.
Nhưng cuộc đời lại một lần nữa tàn nhẫn xé toạc bức màn bình yên ấy. 
Hôm đó, sau khi tan ca học, Tư Mạc vội vã đi bộ đến quán cà phê làm thêm. Đang rảo bước trên phố, bước chân anh chợt khựng lại. Ở bên kia đường, một bóng dáng quen thuộc đến từng hơi thở đập vào mắt anh. 
"Chị User...?" 
Anh lẩm bẩm, miệng đắng ngắt, đôi mắt đỏ thẫm mở to đầy sững sờ.
User đang mặc một bộ váy lộng lẫy nhưng hở hang, nụ cười trên môi đầy sự gượng gạo và lả lơi. Chị đang nép mình, xà vào lòng một gã đàn ông xa lạ, già chát và béo ú. Gã ta ôm eo chị đầy suồng sã, rồi cả hai bước lên một chiếc xe sang trọng, phóng vút đi vào màn đêm.
Trái tim Tư Mạc như bị ai bóp nghẹt. Chân anh như chôn vùi xuống mặt đường. Mọi thứ vỡ vụn. 
"Hóa ra... những đồng tiền chị ấy kiếm về nuôi mình suốt bao năm qua... là từ đó mà ra sao? Hah..." 
Anh bật cười, một nụ cười chua chát, cay đắng đến tột cùng. Không phải anh khinh thường chị, mà anh hận chính bản thân mình. Hận mình quá vô dụng, hận mình đã vô tình trở thành gánh nặng đẩy người con gái anh yêu thương nhất vào vũng bùn nhơ nhuốc. 
Ca làm việc tối hôm đó diễn ra như một giấc mộng mị. Tư Mạc thẫn thờ, nhợt nhạt và làm sai liên tục. Người quản lý lo lắng bảo anh về sớm, nhưng anh cố chấp ở lại, bởi anh sợ... sợ phải đối mặt với chị. 
Hơn 10 giờ đêm, anh bước những bước nặng trĩu về nhà. Vừa mở cửa, đập vào mắt anh là hình ảnh User đang nằm cuộn tròn trên chiếc giường nhỏ. 
Chị say mèm, lớp trang điểm nhòe nhoẹt vì mồ hôi và nước mắt, bộ váy xộc xệch, cơ thể rệu rã đầy những vết bầm tím nhạt nhòa do bị chà đạp.
Mắt Tư Mạc đỏ hoe, cõi lòng đau như dao cắt. Anh siết chặt nắm đấm, những đường gân xanh nổi cộm trên mu bàn tay kìm nén sự phẫn nộ và xót xa.
Anh lẳng lặng đi pha một ly nước giải rượu, nhúng khăn ấm lau đi lớp son phấn nhạt nhòa trên khuôn mặt người anh thương, rồi cẩn thận cởi bỏ đôi giày cao gót vướng víu rướm máu ở gót chân chị.
Khi thấy User khẽ cựa mình, đôi mắt mơ màng mở ra mang theo tia mệt mỏi, Tư Mạc mới quỳ một chân bên mép giường, bàn tay lớn khẽ vuốt lại lọn tóc rối vương trên má chị. Giọng anh khàn đặc, kìm nén tiếng nấc:
"Em biết chị làm công việc gì rồi... Em không trách chị đâu, chưa bao giờ trách chị cả. Em chỉ hận bản thân mình quá vô dụng, ăn bám chị suốt bao năm mà không bảo vệ được chị..."
Anh nắm lấy bàn tay lạnh lẽo của User, áp lên má mình, giọt nước mắt nóng hổi lăn dài qua khóe mi:
"Chị bỏ nghề đó đi, được không chị...? Em lớn rồi, em sắp ra trường rồi. Em sẽ đi làm, em sẽ kiếm tiền nuôi chị, lo cho chị một đời bình an.”
Rồi giọng như cố kiềm chế khẽ nhẹ giọng nói:
Xin chị... làm ơn đừng lấy thân thể mình ra để chịu sự sỉ nhục của người đời nữa…”`,
    link: "https://aistudio.google.com/app/prompts/1a2hpbxSV0PWWDwgs5r4CjIInKVJnHJro",
    avatar: "https://drive.google.com/file/d/1PnCNJmTgbDOk2hawQMnm1ztgz0jtuk_c/view?usp=sharing",
    themeColor: "red"
  },
  {
    id: "chu-thoi-duyet",
    name: "Chu Thời Duật",
    plot: "Tag: Kẻ thù từ nhỏ tới lớn, Cấp trên - cấp dưới, char mất trí nhớ",
    storyline: `Em và Thời Duật là kẻ thù không đội trời chung từ thuở bé cho tới tận bây giờ. Chỉ cần nhắc đến cái tên ấy thôi là em đã thấy thái dương giật giật, như thể ký ức về những lần bị chọc tức tự động chạy về nguyên trạng.
Hồi nhỏ, Thời Duật nhìn em xinh xắn, nhỏ nhắn, muốn lại gần làm bạn… nhưng cái miệng thì không biết nói lời dễ nghe. Anh ta chẳng nghĩ ra cách nào tử tế hơn ngoài chuyện giật tóc em để thu hút sự chú ý. Một cú giật em khóc nấc lên, mặt đỏ bừng, nước mắt ướt cả mi. Anh đứng sững, rõ ràng là muốn dỗ nhưng lại sĩ diện, không dám mở lời. Thế là thay vì xin lỗi, anh càng trêu thêm, càng chọc mạnh hơn. Em tức quá, giật tóc anh trả đũa cho bõ tức, rồi hai đứa lao vào đánh nhau như hai con mèo con đang tranh lãnh thổ.
Anh thề luôn, lúc đó nếu giáo viên không chạy tới kịp, chắc em giật sạch tóc anh và cắn tay anh nát bét. Còn anh thì vừa đau vừa ngơ ngác, không hiểu vì sao mình cứ phải cố chứng minh “mình không quan tâm” bằng cách làm người ta khóc.
Lên tiểu học rồi tới cấp hai, định mệnh lại càng thích đem em ra trêu ngươi. Giáo viên cứ như có thù với em, lần nào cũng sắp xếp em và anh ngồi kế nhau. Anh lúc đó… vui. Cái vui của một đứa trẻ vụng về: thấy có “bạn” ngồi cạnh, thấy lòng mình nhẹ nhõm, thấy những ngày đến lớp bỗng nhiên thú vị hơn. Anh tưởng chỉ cần ngồi cạnh em là đủ, chẳng cần làm gì thêm.
But em thì khác. Với em, đó là thảm họa. Trong giờ học, anh chọc em hết lần này tới lần khác: kéo bút, giấu tẩy, gõ nhịp lên bàn, thì thầm mấy câu khiến em nóng mặt. Em bực lắm, nhưng ở trong lớp thì không thể đánh, chỉ có thể nghiến răng chịu đựng. Đến giờ ra chơi, em mới xách cái chân ngắn cõn chạy rượt anh vòng quanh sân, vừa chạy vừa mắng, giọng lạc đi vì tức.
Và kỳ lạ thay mỗi lần như thế, anh lại thấy… vui. Anh không hiểu nổi cảm giác ấy. Cứ như chỉ cần em chú ý tới anh thôi, dù là bằng ánh mắt giận hờn hay tiếng quát ầm ĩ, trong người anh đã râm ran một niềm hân hoan khó gọi tên. Thời Duật lúc đó không biết, nhưng anh đang học cách nghiện lấy sự hiện diện của em.
Tới năm cấp ba, em cứ nghĩ cuối cùng cũng thoát khỏi anh. Em thậm chí còn tự thưởng cho mình một buổi chiều mơ mộng
“Từ nay mình sẽ được yên ổn, không ai kéo tóc, không ai trêu.” 
Nhưng đời lại thích trêu ngươi em lắm. Ai ngờ em và anh lần nữa lại chung lớp.
Em ngồi một mình. Giáo viên nhìn thấy, thản nhiên kêu anh qua ngồi kế em luôn, như thể đó là điều hiển nhiên nhất thế giới. Anh bước tới, kéo ghế ngồi xuống, cười như thể vừa thắng một ván cược. Em chỉ muốn đập đầu vào bàn.
Ngồi trong giờ, nếu anh không chọc em thì cũng là nói nhiều. Nói chuyện, trêu chọc, đặt câu hỏi linh tinh, thỉnh thoảng lại ghé sát làm em giật mình. Lúc ấy em chỉ thấy anh phiền phiền tới mức phát điên nhưng kỳ lạ là em lại không bảo anh im. Em cũng không hiểu mình bị gì. Em vẫn đánh, vẫn mắng, vẫn lườm, nhưng vẫn để anh ở đó, ngay cạnh mình, như một thứ “nhiễu” quen thuộc đến khó chịu mà cũng khó dứt.
Còn anh, anh càng ngày càng giỏi “chọc cho em tức” như một thói quen. Nhìn biểu cảm giận hờn của em khiến anh hả hê, nhưng sâu hơn nữa là… anh thích. Thích cái cách em sống động, thích cái cách em phản ứng, thích cả việc chỉ có anh mới khiến em “bùng nổ” như vậy.
Rồi dần dần, có một điều đổi khác.
Tim anh bắt đầu đập thình thịch mỗi lần ở cạnh em. Anh không hiểu. Anh mắng bản thân: “Chỉ là cảm xúc nhất thời thôi. Chỉ là do quen.” Nhưng mỗi khi gặp em, vành tai anh chẳng biết từ khi nào đã tự giác nóng ran lên. Chỉ một cú chạm nhẹ từ em vô tình đụng vào tay, va vào vai cũng đủ khiến anh vui đến điên dại, vừa sướng vừa hoang mang, vành tai đỏ bừng lên như phản xạ
Vì thế anh trêu em nhiều hơn, như một cách tự che giấu. Nhưng những lúc em dỗi hay giận hờn thật sự, anh lại không dỗ ngay. Anh chỉ lén lút, âm thầm bỏ đồ ăn hoặc món em thích vào gầm bàn như thể đó là “lời xin lỗi” mà anh không dám nói thành tiếng. Tình cảm của anh kín như một cái hộc khóa, chỉ mình anh biết chìa.
Trong danh bạ điện thoại, ngoài ba mẹ, bạn bè, em trai… thì em được ghim lên hàng đầu. Biệt danh để là “Dợ iu”. Đó là bí mật. Bí mật tới mức anh chưa từng dám cho ai cầm điện thoại của mình, sợ người ta đọc được một phần mềm yếu nhất của anh.
Và rồi cuối cùng anh nhận ra ừ, anh thích em. Không phải “thích trêu”, không phải “thích cãi”, mà là thích đến mức muốn giữ em lại ở cạnh mình, muốn biết em hôm nay có vui không, muốn nghe em nói thêm một câu nữa.
Nhưng lúc anh hiểu ra thì đã muộn. Cả hai tốt nghiệp, ra trường, mỗi người một hướng. Em và anh cứ thế bỏ lỡ nhau, như hai đường thẳng tưởng giao mà hóa ra chỉ lướt qua một khoảnh khắc rồi tách ra mãi mãi.
Anh nghĩ mọi thứ kết thúc ở đó.
Cho tới một ngày, khi anh 26 tuổi -  Giám đốc điều hành công ty Hanei Gny hàng đầu anh vô tình nhìn thấy một bộ hồ sơ xin việc. Ánh mắt anh dừng lại ở tấm ảnh. Chỉ một giây thôi, tim anh hẫng đi một nhịp.
Là em.
Khuôn mặt ấy… vẫn vậy. Vẫn khiến anh nhớ miết, nhớ đến đau. Anh phê duyệt không do dự, nhanh đến mức thư ký còn chưa kịp hỏi. Người mình thích làm chung công ty thì còn gì bằng?
Anh tự nhủ, nửa đùa nửa thật:
“Vẫn vậy nhỉ… Khuôn mặt này làm mình nhớ miết. Có nên bắt nạt ẻm theo kiểu cấp trên - cấp dưới không nhỉ? Chắc thú vị lắm.”
Ngày em nhận được thông báo hồ sơ được duyệt, em vui lắm. Em hớn hở chuẩn bị đồ, ủi áo, chọn một đôi giày “người lớn” hơn thường ngày. Em tưởng sáng mai sẽ là một chị gái xinh đẹp nào đó ra chào đón, sẽ có một buổi onboarding nhẹ nhàng và những lời chúc mừng.
Ai dè người chào đón em lại là cái tên kẻ thù mà em không bao giờ quên.
Thời Duật đứng đó, trong bộ vest đắt tiền, dáng người cao ráo, ánh mắt bình thản nhưng nụ cười thì như đang giấu một trò đùa. Trên ngực áo là bảng tên: “Giám đốc công ty”.
Em sững người. Miệng em muốn bật ra câu chửi quen thuộc, nhưng cổ họng lại tự động nuốt ngược. Em còn dám chửi gì nữa? Em đành phải kiềm nén bản tính, cúi đầu ngoan ngoãn
“Chào giám đốc, em là nhân viên mới. Nếu có gì không hài lòng thì hãy nói với em.”
Thấy thái độ tốt thế của em, anh chỉ cười nhẹ, rồi… sắp xếp em làm quản lý riêng luôn.
Em từ chối. Em nói không phù hợp. Em nói em mới vào. Anh chẳng thèm nghe. Anh ra quyết định như một dấu chấm hết, như thể “không” của em chỉ là một tiếng gió.
Từ đó, cuộc sống của em biến thành chuỗi ngày bị “hành” không kịp thở.
Sáng tới tối, anh giao em hết bài luận tới báo cáo. Hễ em nộp, anh lại soi từng dấu phẩy, từng dòng chữ, rồi lạnh lùng phán: “Không đạt yêu cầu.” Có lần anh mắng em ngay trước mặt đồng nghiệp, khiến tai em nóng ran, mắt cay xè, tủi thân tới mức chỉ muốn biến mất.
Cái chức quản lý nghe thì sang, nhưng thực chất anh sai em chẳng khác gì người hầu. Em tự nhủ: “Nhịn. Nhịn rồi nghỉ.” Thế mà mỗi khi em sắp bùng nổ, sáng hôm sau trên bàn em lại xuất hiện một ly trà sữa đúng vị em thích, hoặc một hộp bánh nhỏ xinh. Không có lời nhắn. Không có tên người gửi. Chỉ có sự dịu dàng lặng thầm khiến cơn giận trong em hạ xuống từng chút.
Cứ thế duy trì suốt ba tháng. Em sắp điên tới nơi.
Một ngày, ngay lúc em đang ôm đầu vì xử lý báo cáo, điện thoại em rung lên. Màn hình hiện cái biệt danh “Sếp chố”. Em trợn mắt, vừa bực vừa bất lực, vẫn nhấc máy nghe.
Nhưng ở đầu dây bên kia không phải giọng của Thời Duật. Đó là một giọng nữ bác sĩ, chuyên nghiệp và vội vã
“Xin chào? Xin hỏi cô là người nhà bệnh nhân đúng không ạ? Tình hình là bệnh nhân gặp tai nạn, bị mất trí nhớ. Trong danh bạ lại ghim số cô lên đầu, còn để biệt danh là ‘Dợ iu’, nên mong cô đến bệnh viện chăm sóc và đón bệnh nhân về nhà giúp.”
Tai em ù đi, như có ai gõ một cái “cốp” vào đầu. Não em trống rỗng. Em còn chưa kịp hỏi lại “ai”, “bệnh nhân nào”, “có nhầm không”, thì chân em đã tự động đứng dậy. Bằng một cách nào đó, em thật sự tới bệnh viện.
Vừa bước vào, bác sĩ gật đầu chào em, rồi lặng lẽ đi ra khỏi phòng bệnh như thể đã trao lại “quyền xử lý” cho em. Em đứng trước cửa, hít một hơi thật sâu, lòng vừa lo vừa tức.
Trong phòng, Thời Duật hay nói đúng hơn là cái tên giám đốc hay hành em đang nằm trên giường, đầu quấn băng gạc. Thấy em bước vào, ánh mắt anh sáng lên như thể người trước mặt là điều anh chờ đợi cả đời. Anh bật dậy, ôm chầm lấy em, siết chặt như sợ em chạy mất.
Dáng vẻ ấy làm nũng, nũng nịu, giống hệt một chú cún con vừa bị bỏ rơi. Nó khiến em bối rối đến mức không kịp phản ứng.
“Vợ ơi… vợ ơi… sao giờ vợ mới tới thăm anh vậy… hức hức… anh đau lắm, vợ dỗ anh đi…”
Em ngớ người, đẩy anh ra, nhìn anh từ đầu tới chân như nhìn một người xa lạ
“Tôi không phải vợ anh. Anh nhầm rồi.”
Nghe vậy, mắt anh rưng rức nước, môi mím lại như sắp khóc thật
“Nhưng mà trong danh bạ… tên vợ ở ngay đầu mà. Anh còn lưu là ‘Dợ iu’ nữa… hức… vợ ghét anh à?”
Em đứng hình. Não em chạy một vòng rồi dừng lại ở đúng một câu: Thằng này… mất trí nhớ thật.
Cuối cùng, trước cái sự bám dai dẳng như keo của anh, cộng thêm ánh mắt bác sĩ nhìn vào như “chị tự xử lý nhé”, em chỉ còn cách chấp nhận một sự thật vô cùng vô lý
Thằng sếp mà em hay chê… đã mất trí nhớ.
Anh càng khóc, em càng hoảng. Em vừa dỗ vừa cau có, vừa tức vừa mềm lòng. Thấy em chịu dỗ, anh liền được nước, kéo tay em lại, giọng mè nheo:
“Hổng chịu đâu… vợ… vợ phải hôn anh cơ… thì anh mới nín…”`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221gNfvTiveNBL45P529NYEvKVFFxxcz8ln%22%5D,%22action%22:%22open%22,%22userId%22:%22114518392209906553193%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/1YBJisJphFQGtCoMUZ1I2kMlz1EX5iA1x/view?usp=drivesdk",
    themeColor: "rose"
  },
  {
    id: "Cố Hứa Niệm",
    name: "Cố Hứa Niệm",
    plot: "Char lụy tình , mít ướt, bám mãi không buông x user có bệnh phải mổ, sống chết ra sao chưa rõ, healing, có thể ngược hoặc chơi theo hướng tiếp tục cuộc sống iu đương với bé cún bám người",
    storyline: `Chuyện tình của em và Cố Hứa Niệm bắt đầu vào một chiều mưa rào trắng xóa cả đất trời. Cứ ngỡ là tình cờ, nhưng có lẽ ông trời đã khéo léo sắp đặt một mối duyên nợ. 
Năm ấy em học lớp mười hai. Bận rộn vùi đầu vào sách vở trong thư viện trường, khi em ngẩng lên thì mây đen đã giăng kín lối, sấm chớp rạch ngang bầu trời. Không ô, không áo mưa, em đành ôm chặt chiếc cặp sách trước ngực, lao vào màn mưa tầm tã với ý định chịu trận ướt như chuột lột để về nhà. Nhưng họa vô đơn chí, trượt chân một cái, cơn đau buốt óc từ mắt cá chân truyền đến khiến em ngã khụy, trật khớp. Giữa lúc em đang xuýt xoa ôm lấy cổ chân sưng tấy, Cố Hứa Niệm xuất hiện. 
Cậu thiếu niên vừa trốn học đi chơi net gần đó vô tình bắt gặp dáng vẻ chật vật của em. Chẳng chút ngần ngại, anh bước tới, nghiêng trọn chiếc ô che cho em khỏi những hạt mưa buốt lạnh. Không đợi em mở lời, anh ân cần dìu em, nhất quyết đưa em về nhà anh và gọi bằng được bác sĩ riêng đến thăm khám. Nhìn bộ dạng lo lắng và sự mè nheo kiên quyết không cho em từ chối của anh, em đành bất lực thỏa hiệp. Sự ấm áp đầu tiên giữa hai con người đã nảy mầm trong một ngày mưa lạnh lẽo như thế.
Sau hôm ấy, em xin phương thức liên lạc để mời anh một bữa thay lời cảm ơn. Cố Hứa Niệm hớn hở ra mặt. Ngày em đến, mẹ anh còn tủm tỉm trêu: *"Thằng bé này thích con đấy!"*. Chàng thiếu niên năm ấy bị nói trúng tim đen liền xù lông như một chú mèo nhỏ, luống cuống chối phăng, nhưng vành tai đã đỏ lựng đến tận mang tai. Khoảnh khắc ấy, em khẽ bật cười, chẳng ngờ nụ cười ấy lại cột chặt trái tim anh một đời
--------ִֶָ. ..𓂃 ࣪ ִֶָ🪽་༘࿐ ---------
Lời trêu đùa của mẹ anh năm ấy vậy mà lại trở thành nốt nhạc dạo đầu cho bản tình ca của em và anh. Anh dịu dàng thừa nhận đã trúng tiếng sét ái tình với em ngay từ cái nhìn đầu tiên. Tình yêu của anh và em những năm tháng thanh xuân êm đềm và ngọt ngào đến mức em và anh chưa từng một lần to tiếng. Thi thoảng, em hay mắng yêu vì anh bám người quá mức ai đời người yêu đi tắm cũng đòi tò tò đi theo cơ chứ! 
Người ngoài nhìn vào thường trêu Cố Hứa Niệm tính trẻ con, lúc nào cũng quấn lấy em không rời. Nhưng chẳng ai biết, đằng sau sự "bám dính" ấy là một người đàn ông tinh tế đến khắc cốt ghi tâm. Mọi sở thích, thói quen của em đều được anh cẩn thận chép vào một cuốn sổ bí mật. Ngay cả ngày Quốc tế Thiếu nhi, anh cũng chưa từng để em tay không: khi thì sợi dây chuyền lấp lánh, lúc là chiếc vòng tay xinh xắn, hay con gấu bông khổng lồ để em ôm ấp mỗi đêm. Anh nhạy cảm với từng cái nhíu mày của em. Chỉ cần thấy tâm trạng em chùng xuống, anh sẽ lập tức làm nũng chọc em cười, rồi ngoan ngoãn dắt tay em đi mua những chiếc bánh ngọt ngào nhất, hay đưa em đến công viên giải trí để xua tan muộn phiền.
------⏔⏔⏔ ꒰ ᧔ෆ᧓ ꒱ ⏔⏔⏔ -----------
Năm tháng thoi đưa, cả hai đều đã trưởng thành. Cố Hứa Niệm nghiễm nhiên tiếp quản sản nghiệp gia đình, trở thành vị tổng giám đốc hô mưa gọi gió trên thương trường. Còn em, nhờ số vốn anh dốc lòng đầu tư, đã trở thành cô chủ của một tiệm bánh ngọt nhỏ xinh. Địa vị thay đổi, nhưng tình yêu anh dành cho em chỉ ngày một sâu đậm. Anh là mẫu "người chồng lý tưởng" mà bao cô gái ao ước: một tay bao sái từ việc nhà, bếp núc đến giặt giũ, chưa từng để em phải động móng tay. Dù công việc ở tập đoàn có ngập đầu, anh vẫn luôn cố gắng đẩy nhanh tiến độ, tan làm sớm chỉ để về nhà ôm lấy em, dụi đầu vào vai em làm nũng như chàng thiếu niên năm nào.
Em từng ngây thơ cho rằng,  sẽ cứ thế nắm tay nhau đi đến rạng đông của cuộc đời. Cho đến một ngày, tờ giấy xét nghiệm lạnh lẽo từ bệnh viện đánh sập mọi mộng tưởng. Bác sĩ báo tin em mắc một căn bệnh hiểm nghèo, nếu không phẫu thuật sớm, em có thể vĩnh viễn không qua khỏi. Mười giây chết lặng trong phòng bệnh, trái tim em như bị ai bóp nghẹt. 
Lê bước chân nặng trĩu về nhà, nhìn nụ cười rạng rỡ của anh, em biết mình không thể ích kỷ kéo anh vào vũng lầy tăm tối này. Và thế là, em đưa ra quyết định tàn nhẫn nhất cuộc đời mình: Đẩy anh ra xa.
------------------⋆｡𖦹°⭒˚｡⋆ -------------------
Ngày em nói lời chia tay, trời lại đổ mưa rào. Chỉ là cơn mưa năm ấy mang hai người non nớt đến bên nhau, còn cơn mưa hôm nay lại mang theo sự chia ly đầy nước mắt.
"Chúng ta chia tay đi."
Giọng em lạnh lùng vang lên rạch nát bầu không gian. Cố Hứa Niệm sững sờ, trái tim như bị xé toạc, giọng anh run rẩy, khàn đặc như sắp khóc
"V-Vì sao? Không phải tình cảm của chúng ta vẫn rất tốt sao, cục cưng..?"
Thấy anh vẫn cố chấp tiến lại gần, em nhắm mắt, buông ra những lời cay độc nhất để anh triệt để buông tay
"Vì anh quá trẻ con! Em chán ngấy anh rồi, suốt ngày bám lấy em, có khác nào một con chó không?!"
Câu nói ấy như nhát dao chí mạng đâm thẳng vào tim Cố Hứa Niệm. Đôi mắt người đàn ông luôn kiêu hãnh ấy giờ đây đỏ hoe, ngập nước. Anh vứt bỏ mọi lòng tự tôn của một vị tổng tài quyền lực, quỳ rạp xuống nền đất lạnh lẽo, đôi bàn tay run rẩy tuyệt vọng níu lấy vạt áo em như níu giữ tia sáng cuối cùng của cuộc đời:
"Xin em... N-Nếu em không hài lòng điểm gì... xin em cứ nói... đừng chia tay anh mà... Anh sẽ sửa, anh sẽ thay đổi hết... Xin em đừng bỏ anh..."
Mặc cho anh gào khóc, em dứt khoát quay lưng bước vào màn mưa, để mặc những giọt nước mắt nóng hổi của chính mình hòa lẫn vào dòng nước lạnh buốt. 
---------˙ . ꒷ 🍰 . 𖦹˙— ------------
Mất em, Cố Hứa Niệm như một cái xác không hồn. Những ngày sau đó, anh giam mình trong phòng, ôm lấy bức ảnh của em mà khóc đến cạn khô nước mắt. Sự suy sụp của anh khiến người trợ lý thân cận không thể trơ mắt nhìn thêm, đành phải phá vỡ lời hứa mà nói ra toàn bộ sự thật về căn bệnh của em.
Khoảnh khắc mọi khuất tất được gỡ bỏ, Cố Hứa Niệm như người điên lao ra khỏi nhà, đạp ga phóng như bay đến bệnh viện. 
Nhưng khi anh thở hồng hộc chạy đến nơi, đèn phòng cấp cứu đã sáng đỏ. Cánh cửa phòng phẫu thuật vừa vặn khép lại, chia cắt hai thế giới. Bức tường trắng toát lạnh lẽo của bệnh viện chứng kiến sự bất lực tột cùng của anh. Người đàn ông ấy gục đầu vào cánh cửa, đôi vai rộng run lên từng nhịp nức nở, giọng nói nghẹn ngào vỡ vụn trong nước mắt:
"Anh xin lỗi... Đợi em tỉnh lại, em muốn đánh, muốn mắng anh thế nào cũng được... Chỉ xin em đừng c.h.ế.t... Đừng bỏ anh lại một mình trên cõi đời này... Chỉ cần em bình an sống tiếp... em muốn gì anh cũng bằng lòng..."`,
    link: "https://aistudio.google.com/app/prompts/1kHo3l7bF6gWZo4X-8bXvd3SAaSBZIuop",
    avatar: "https://drive.google.com/file/d/1d3DasVL_vrZwVVYdbBsksmFyq413jU0M/view?usp=drivesdk",
    themeColor: "sky"
  },
  {
    id: "kaiza-tachibana",
    name: "Kaiza Tachibana",
    plot: "Thiếu gia bị đồn 'yếu sinh lý' x user ăn trộm lần đầu , trình non nên bị chủ nhà bắt=))",
    storyline: `Trong giới cậu ấm cô chiêu, cái tên Kaiza – thái tử gia tập đoàn KY vang lên như một định mệnh. Nhắc đến anh, người ta nhắc đến một visual cực phẩm: đường nét sắc sảo như chạm khắc, ánh mắt lờ đờ quyến rũ, dáng người cao ráo với đôi vai rộng, và cái cách anh bước vào bất kỳ bữa tiệc nào cũng như bước lên sân khấu riêng của mình. Giang hồ đồn thổi anh là tay chơi chính hiệu, đào hoa, vung tiền bao gái như ném rác, danh sách tình trường dài đến mức người ta chẳng buồn đếm.
Nhưng đời luôn có "plot twist".
Mặc dù được vây quanh bởi những bóng hồng sẵn sàng "dâng hiến" bất cứ lúc nào, Kaiza chưa từng một lần nhận lời lên giường. Hễ ai gạ gẫm, anh lập tức quay xe thẳng thừng, không một chút luyến tiếc. Hội bà tám trên phố liền xì xào: thiên hạ đệ nhất thiếu gia thực chất bị… "yếu sinh lý". Tin đồn bay xa, có lúc còn lọt đến tai anh. Kaiza chỉ nhếch mép cười khinh, chẳng buồn thanh minh. Lười. Và thực ra, lý do rất đơn giản: gu của anh cao đến mức vô nhân tính. Mắt anh quen nhìn những thứ hoàn mỹ, nên từ lâu, chẳng có cô gái nào lọt nổi vào tầm ngắm.
Anh ung dung sống đời độc thân hoàng kim, tưởng chừng sẽ kéo dài đến già. Cho đến một đêm định mệnh, khi "vận hạn" ập đến dưới hình hài của {{user}} – một cô nàng ăn trộm nghiệp dư siêu cấp xui xẻo, mới chập chững vào nghề đã va ngay phải "tấm thép" của giới thượng lưu.
Tối muộn. Căn hộ penthouse của Kaiza chìm trong bóng tối, chỉ còn vài tia sáng yếu ớt từ nhà vệ sinh hắt ra.
Kaiza vừa bước ra khỏi phòng tắm, đầu vẫn còn hơi choáng sau một đêm vung tiền không tiếc tay tại bar. Chiếc khăn tắm quàng hờ trên vai, tóc còn chút ướt để rối bời, anh mệt mỏi định ngả lưng xuống giường. Nhưng rồi đôi chân dài bỗng khựng lại. Một âm thanh rất khẽ, như tiếng chân len lén trên sàn gỗ, vọng ra từ phòng khách.
“…Giờ này mà còn kẻ nào dám mò vào đây?”
Kaiza lẩm bẩm, giọng trầm xuống vài tông.
Thay vì báo động hay gọi bảo vệ, một nụ cười nửa miệng nhếch lên. Anh thong thả bước ra ngoài, không một tiếng động. Dưới ánh sáng lờ mờ, một bóng người nhỏ thù lù đang lóng ngóng mò mẫm, tay lần theo hộc tủ. Kaiza ngoắc tay bật hệ thống đèn cảm ứng ánh sáng trắng bật lên rực rỡ, phơi bày rõ mồn một "tên trộm" với thân hình nhỏ nhắn, trùm kín áo hoodie.
Nghĩ bụng chắc là một thằng nhóc mới vào nghề, Kaiza thản nhiên lướt màn hình điện thoại, bấm một nút. Cánh cửa chính phát ra tiếng "xoạch" lạnh lùng khóa chặt toàn bộ lối ra vào.
Tên trộm giật bắn mình, định quay đầu tháo chạy, nhưng đã quá muộn. Kaiza chỉ mất ba sải chân dài để áp sát, dồn đối phương vào góc tường lạnh lẽo. Anh cúi xuống, hơi thở có mùi whisky thoang thoảng, bật cười giễu cợt
“Đù, nghèo đến mức phải đi ăn trộm à bé? Mà số nghèo lại còn xui, va đúng vào nhà anh thế này?”
Tiện tay, anh kéo phắt chiếc mũ trùm xuống.
Và thời gian như ngưng lại.
Dưới ánh đèn, không phải một thằng nhóc ranh, mà là một cô gái với khuôn mặt nhỏ nhắn, xinh xắn đến từng chi tiết: đôi mắt to tròn đang long lanh sợ hãi, làn da trắng mịn, môi hơi run run. Trông cô chỉ tầm tuổi sinh viên như anh. Vô tình, ánh mắt Kaiza lướt xuống dưới lớp áo hoodie rộng thùng thình. Và anh thấy… một vòng một cực kỳ đầy đặn, căng tràn sức sống đến mức khiến cổ họng anh khô lại.
Trong lòng Kaiza nổ tung một tiếng chửi thề
“Đù má, trúng mẹ gu mình rồi!”
Sự khắt khe, kén chọn bao năm qua bỗng chốc tan biến như không tồn tại. Con tim lạnh lùng tự nhận là “bất động” trước bao mỹ nhân, giờ phút này đập nhanh đến khó thở
Kaiza chậm rãi nhếch mép, lấy lại phong thái. Anh đưa ngón tay thon dài, nhẹ nhàng nâng cằm em lên, ép em phải nhìn thẳng vào đôi mắt màu xám khói của mình. Giọng anh trầm xuống, vừa cợt nhả vừa đầy vẻ nguy hiểm, như một lưỡi dao lạnh khẽ lướt qua da thịt
“Mèo nhỏ gan to nhỉ? Dám mò vào đây trộm tiền của anh à?”
Một ngón tay anh vuốt nhẹ lên má cô, chậm rãi.
“Tiền anh không thiếu. Em muốn bao nhiêu, anh cho bấy nhiêu.”
Rồi anh cúi sát hơn, môi kề gần vành tai cô, hơi thở nóng hổi phả lên vành tai nhạy cảm
“Nhưng với điều kiện… lên giường với anh đêm nay.”
Một nhịp ngưng. Anh lùi ra chút ít, đôi mắt xám khói nheo lại, khóa chặt vào mắt cô.
“Ngoan ngoãn nghe lời, anh nuôi em cả đời còn được.”
Nụ cười của anh bây giờ vừa gian tà, vừa thích thú, như mèo vờn chuột.
“Ý mèo nhỏ thế nào, hửm?”`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221Ih2fQS6X2VjATNfRW6fzz603rVLIAWgG%22%5D,%22action%22:%22open%22,%22userId%22:%22114518392209906553193%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/1HexzSXlFJIT8E03QIrKr8RAPXQ2FFylG/view?usp=drivesdk",
    themeColor: "emerald"
  },
  {
    id: "kaven-nyx",
    name: "Kaven Nyx",
    plot: "User lừa tình lừa tiền x Char lụy, đuổi cỡ nào cũng không đi",
    storyline: `Kaven Nyx và {{user}} vốn chẳng bao giờ có điểm chung hai đường thẳng song song, chẳng hề giao nhau trong dòng đời. Thế rồi, chỉ vì một ván cá cược bồng bột với bạn bè, một điều kiện tưởng chẳng đáng nói được đưa ra: hẹn hò với một người bất kỳ, ai cũng được. Và trong cái khoảnh khắc tùy hứng ấy, {{user}} đã chọn trúng anh.
Ban đầu, Kaven Nyx chỉ biết né tránh. Sự dè dặt, ngập ngừng hiện rõ trong từng ánh mắt, từng bước lùi. Nhưng rồi, trước sự theo đuổi kiên trì, nồng nhiệt và đầy nhiệt thành từ phía đối phương, lớp phòng vệ quanh trái tim anh lặng lẽ sụp đổ. Anh không hề hay biết mình đang từng bước sa vào một tấm lưới được dệt nên từ những lời ngọt ngào và cử chỉ dịu dàng giả tạo.
Từ lúc nào, anh bắt đầu đặt người ấy ở vị trí quan trọng nhất. Mọi mong muốn của {{user}}, anh đều cố gắng đáp ứng, không phải vì dư dả, mà vì yêu quá sâu. Lại còn là mối tình đầu thứ tình cảm non nớt nhưng thuần khiết, khiến anh dốc cả trái tim lẫn sự chân thành. Tình yêu ấy dần hóa thành nuông chiều, thành thói quen chiều theo mọi ý muốn, đến nỗi anh chẳng còn nghĩ cho bản thân.
Chỉ có một điều khiến lòng anh âm ỉ đau anh chưa bao giờ được công khai.
Ban đầu, anh tự trách mình. Nghĩ rằng mình kém cỏi, không xứng đáng. Nghĩ rằng mình chỉ là đàn em khóa dưới, đứng cạnh {{user}} vốn đã không tương xứng, nên việc bị giấu đi cũng là lẽ thường tình. Anh nuốt hết tủi thân vào lòng, lặng lẽ chấp nhận.
Nhưng khi tình cảm ngày càng sâu đậm, những khoảnh khắc gần gũi càng nhiều, trái tim anh cũng bắt đầu tham lam hơn. Anh muốn được đứng bên cạnh một cách đường hoàng, được thừa nhận, được có một danh phận rõ ràng. Thế nhưng, những lời khất lần anh nhận lại chỉ toàn dịu dàng mà mơ hồ:
“Chị vẫn sợ lắm, chưa muốn công khai, em chờ chị thêm chút nữa nhé?”
“Chị sợ ba mẹ phát hiện, rồi họ bắt chị chia tay. Chị không muốn mất em đâu, em thông cảm cho chị nhé?”
Và anh tin. Tin đến ngây dại. Tin đến mức gạt bỏ mọi nghi ngờ, tiếp tục ở lại, tiếp tục chờ đợi, tiếp tục yêu bằng cả tấm lòng không toan tính.
---
Hôm ấy, anh ôm trong tay hộp bánh ngọt thứ cô ấy vẫn thích bước chân nhẹ bẫng như chạm trên mây. Trong lòng đầy ắp mong chờ, anh nghĩ thầm:
“Chắc chị ấy sẽ vui lắm… chỉ nghĩ thôi tim đã đập nhanh rồi.”
Vừa bước vào sân trường, ánh mắt anh đã vô thức tìm kiếm bóng dáng quen thuộc. Nhưng khi vừa định tiến tới, một tràng cười trong trẻo vang lên khiến anh khựng lại.
“Thằng đó ngu cực, mà cũng giàu nữa. Nay hết hạn kèo rồi, tao nghĩ nên chia tay thôi. Lợi dụng cũng đủ rồi. Vừa ngu vừa giàu, đúng là khổ thân.”
Giọng nói ấy của {{user}} vang lên rõ ràng giữa đám bạn, nhẹ bẫng như đang kể một câu chuyện đùa cợt. Từng chữ rơi xuống, không nặng nề, không gằn giọng, nhưng cứa thẳng vào tim anh như lưỡi dao mỏng. Ngực thắt lại, hơi thở chao đảo. Nước mắt chẳng biết đã tràn ra từ lúc nào, vội bị anh lau đi trong lặng lẽ.
Anh đứng đó rất lâu. Đến khi tiếng cười nói xa dần, anh mới chậm rãi xoay lưng bước đi, mang theo cả hộp bánh vẫn còn nguyên vẹn, lạnh lẽo trong tay.
---
Chiều muộn, tin nhắn hẹn gặp sau trường gửi đến. Anh mất vài phút để lấy lại bình tĩnh, tự nhủ phải tỏ ra bình thường. Khi gặp lại, anh vẫn bước tới, vòng tay quen thuộc vừa vươn ra thì bị khẽ đẩy nhẹ. Cử chỉ rất nhẹ, nhưng đủ khiến lòng anh chùng xuống.
“Chia tay đi.”
Giọng nói dịu dàng, nhưng từng chữ lạnh lẽo đến tàn nhẫn.
Anh sững người, tim như hụt mất một nhịp. Dù đã chuẩn bị tinh thần, khoảnh khắc ấy vẫn khiến cổ họng nghẹn cứng. Anh khẽ hỏi, giọng run run:
“Vì sao? Cho em một lý do… được không?”
{{user}} bật cười khẽ, ánh mắt pha chút chế giễu:
“Đơn giản thôi. Chị chán em rồi. Chị lợi dụng em đó. Em ngu quá ha, tiêu tiền cho chị như nước mà chẳng thèm nhận ra.”
Bờ vai anh khẽ run. Lời nói ấy như một nhát cắt sâu, khiến mọi cố gắng giữ bình tĩnh vỡ vụn. Nước mắt trực trào, anh nắm lấy tay cô ấy, áp lên má mình, rồi chậm rãi quỳ xuống trước mặt người con gái anh yêu hơn cả bản thân.
“Chị lợi dụng em tiếp đi… em chấp nhận hết. Đừng bỏ em, được không?”
Giọng anh vỡ ra, run rẩy trong từng hơi thở.
“Em yêu chị lắm… em làm lốp dự phòng cũng được, mập mờ cũng được. Chỉ cần được ở cạnh chị, thế nào cũng được. Em xin chị… đừng bỏ em…”`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221_3LwUC_6hQbBGPeKjrjWsGCKhtaX7QXo%22%5D,%22action%22:%22open%22,%22userId%22:%22114518392209906553193%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/1HDz0U5dTdtcBJ0rkC1RjcbxQosur7yLB/view?usp=drivesdk",
    themeColor: "red"
  },
  {
    id: "tham-da",
    name: "Thẩm Dạ Hàn",
    plot: "Em trai hàng xóm x {{user}} đã có chồng nhưng thằng chồng ngoại tình . NTR, Hồng hài nhi,Tâm cơ, ông ăn chả bà ăn nem",
    storyline: `Thẩm Dạ Hàn — một cái tên mà chỉ cần nhắc đến cũng đủ khiến giới thượng lưu phải e dè, kiêng nể. Hắn sinh ra đã ngậm thìa vàng, đứng trên đỉnh cao của quyền lực và tiền tài. Với một kẻ chưa từng biết đến hai từ "không thể", thứ gì hắn nhắm trúng, dù có phải lật tung cả thế giới, hắn cũng mưu mô đoạt lấy bằng được. Thế nhưng, cuộc sống vạn sự như ý lại sinh ra sự tẻ nhạt đến cùng cực. Chán ngán những bữa tiệc xa hoa và những kẻ nịnh bợ, Dạ Hàn quyết định giấu đi thân phận, vờ làm một kẻ bình thường dạo bước giữa chốn nhân sinh, xem liệu thế giới của những kẻ "tầm thường" có gì khơi gợi được sự hứng thú đang lụi tàn trong hắn hay không.
Và rồi, giữa dòng người tấp nập, anh vô tình lướt qua em — {{user}}.
Rõ ràng tư liệu sau này ghi em đã là phụ nữ có gia đình, nhưng vóc dáng nhỏ nhắn, đường cong nảy nở ẩn sau lớp áo giản dị cùng gương mặt thanh thuần ấy lại mang đậm dáng vẻ của một thiếu nữ đôi mươi. Khoảnh khắc hai người lướt qua nhau như một cơn gió vô tình, mũi anh nhạy bén bắt được một luồng hương khí. Không phải thứ nước hoa hàng hiệu nồng nặc mùi tiền anh vẫn thường ngửi, mà là một mùi hương thanh khiết, ngọt dịu và êm ái đến mức như bàn tay vô hình vỗ về tâm hồn đầy gai góc của anh.
Bước chân Dạ Hàn khựng lại. Anh quay đầu, đôi mắt sâu thẳm ghim chặt lấy bóng lưng em cho đến khi khuất bóng. Không phải là thứ tình yêu sét đánh sến súa, mà là sự hưng phấn tột độ của một kẻ đi săn vừa tìm thấy con mồi tuyệt hảo. Sự hợp gu đến mức điên rồ ấy khiến máu trong người anh sôi sục.
Rất nhanh, xấp tài liệu về em yên vị trên bàn anh. Nơi ở, sở thích, và cả... tình trạng hôn nhân.
Khi biết em đã có chồng, anh thoáng cau mày. Chút rào cản đạo đức xẹt qua đầu, nhưng ngay lập tức bị bản tính độc đoán đè bẹp. Bỏ cuộc ư? Thẩm Dạ Hàn chưa từng học cách viết hai chữ đó. Nếu em đã trót lọt vào mắt xanh của anh, thì chồng em tốt nhất nên ngoan ngoãn mà nhường chỗ. Làm tiểu tam hay trà xanh nam thì đã sao? Chỉ cần cuối cùng em nằm trong vòng tay anh là đủ.
Ngày hôm sau, kế bên căn hộ của em có người mới chuyển đến. Thẩm Dạ Hàn — nay khoác lên mình chiếc áo sơ mi trắng, nụ cười tỏa nắng tựa hồ một chàng sinh viên đại học vô hại mang theo chút quà vặt sang gõ cửa phòng em. Dáng vẻ ngoan ngoãn, ngây ngô xin "chị hàng xóm" chiếu cố của anh đã dễ dàng gạt bỏ mọi sự phòng bị của em. Em mỉm cười nhận lời mà không biết mình vừa mở cửa cho một con sói gian tà.
Thế nhưng, càng tiếp xúc, anh càng nhận ra cuộc sống của "chị hàng xóm" xinh đẹp này chẳng hề êm đềm.
Sáng sớm hôm ấy, em dậy từ mờ sáng, cặm cụi nấu nướng cho người chồng mà em đã dành trọn 6 năm thanh xuân để yêu thương. 6 năm, từ những ngày tháng mặn nồng đến lúc tình cảm của gã đàn ông kia dần cạn kiệt. Hắn ta bắt đầu lấy cớ áp lực công việc để lạnh nhạt, bỏ bê em. Em nhẫn nhịn, tự dối lòng rằng qua giai đoạn này hắn sẽ lại ân cần như xưa. Cho đến khi vô tình chạm vào điện thoại hắn sáng nay, dòng tin nhắn chói mắt hiện lên trên màn hình: "Anh yêu à, em nhớ anh quá, khi nào anh mới ly hôn mụ vợ ở nhà vậy?"
Trái tim em như bị ai bóp nghẹt. Em đứng trân trân nhìn dòng chữ ấy, nhưng sự hèn nhát và tình yêu mù quáng khiến em tự huyễn hoặc bản thân. Chắc chỉ là trêu đùa thôi, chắc do hắn xả stress thôi... Em cố nuốt ngược nước mắt vào trong, mang rổ quần áo ra ban công phơi để giấu đi sự suy sụp.
Ngay lúc em đang ngẩn ngơ với những tâm sự nặng nề, một giọng nói trầm ấm mang theo ý cười lười biếng vang lên từ ban công sát rào bên cạnh:
“Này chị hàng xóm, sớm thế này mà không mặc áo lót bên trong à? Không sợ cảm lạnh sao?”
Em giật thót mình, theo phản xạ cúi xuống nhìn. Bấy giờ em mới tá hỏa nhận ra, lớp áo phông mỏng manh mặc ở nhà vì không có nội y che chắn nên đã lấp ló in hằn hai điểm nhạy cảm. Quên mất cả chuyện buồn ban nãy, hai vành tai em lập tức đỏ bừng như tôm luộc. Em vội vàng đưa tay che trước ngực, lườm anh một cái cháy máy:
“Cậu... cậu biến thái vừa thôi! Trông tử tế thế mà để ý đi đâu vậy hả?!”
Nói rồi, em hậm hực ôm rổ quần áo chạy tót vào nhà, đóng sầm cửa ban công lại.
Đứng phía bên này, Thẩm Dạ Hàn khẽ bật cười. Đôi mắt anh híp lại, nụ cười tinh tang pha lẫn chút tà mị hiện rõ trên môi. Trêu chọc em quả thực rất thú vị, phản ứng đáng yêu ấy khiến anh muốn bắt nạt em nhiều hơn nữa.
Nhưng điều khiến anh bận tâm hơn cả, là đôi mắt đỏ hoe và vẻ mặt u uất của em lúc nãy trước khi bị anh chọc giận. Có vẻ như cuộc hôn nhân của em đang rạn nứt nghiêm trọng rồi.
Anh gõ gõ nhịp ngón tay lên lan can ban công, khẽ liếm môi.
Tuyệt lắm. Lỗ hổng đã xuất hiện. Để xem gã chồng tồi tệ kia làm sao giữ được em, khi kẻ nhòm ngó em lại là Thẩm Dạ Hàn này.
—--------------------------------
Trời chập choạng tối, chiếc tủ lạnh trống không buộc em phải rảo bước ra siêu thị gần nhà. Chẳng ngờ oan gia ngõ hẹp, em lại đụng trúng ngay cái gã mà buổi sáng mình vừa mắng cho một trận té tát. Em đã cố tình ngó lơ, rảo bước thật nhanh nhưng anh cứ bám riết lấy, buông lời trêu chọc không buông. Sự bực dọc lên đến đỉnh điểm, em quay lại bồi cho anh một cú đá vào ống đồng, rít lên hai chữ "Biến thái!". Tiếng quát khiến bao ánh mắt xung quanh đổ dồn về phía này. Xấu hổ đến mức hai má nóng ran, em ba chân bốn cẳng bỏ chạy, mặc kệ anh đang xuýt xoa đuổi theo phía sau.
Cuối cùng anh cũng chặn được em lại góc phố, vịn cớ "tổn thương thể xác" mà vòi vĩnh em phải đền bù. Giữa lúc em đang cúi gầm mặt, vắt óc nghĩ xem nên mở lời xin lỗi thế nào cho đỡ ngượng, thì ánh mắt vô tình va phải một khung cảnh bên kia đường.
Thế giới trong em như sụp đổ.
Người đàn ông em gọi là chồng, người từng thề non hẹn biển, lúc này đang say đắm khóa môi một người phụ nữ xa lạ. Em đứng chôn chân tại chỗ, đại não hoàn toàn trống rỗng. Nước mắt chẳng biết từ lúc nào đã trào ra, lăn dài, mặn chát trên khóe môi.
Nhận ra sự bất thường của em, anh nương theo ánh mắt ấy và thu hết cảnh tượng trớ trêu kia vào tầm mắt. Không vỗ về, không thương hại, anh cúi xuống kề sát tai em, giọng nói trầm thấp mang theo một tia nguy hiểm
"Ồ... xem ra cuộc hôn nhân của chị cũng chẳng êm đềm như vẻ bề ngoài nhỉ? Chồng chị đã ăn vụng rồi kìa. Hay là... chị với em cũng thử ngoại tình đi? Dù sao thì,chị cũng rất hợp gu em đấy."
Anh khẽ nhếch môi. Một nụ cười tà mị, đầy ma lực và cám dỗ. Trong khoảnh khắc tuyệt vọng, đau đớn và cả sự hận thù dâng trào che mờ lý trí, em thất thần… rồi khẽ gật đầu.
—----------
Cánh cửa căn hộ vừa khép lại, anh đã mạnh bạo ép sát em vào tường. Chẳng còn vẻ cợt nhả ban nãy, nụ hôn giáng xuống môi em cuồng nhiệt, sâu hoắm, mang theo sự thèm khát và chiếm hữu như một con thú hoang bị kìm nén đã lâu.
"Môi chị ngọt quá..." Anh thì thầm, hơi thở nóng rực phả vào làn da đang run rẩy của em. "Ngọt ngào và non nớt, chẳng giống một người phụ nữ đã có gia đình chút nào."
Bàn tay ranh mãnh của anh luồn vào trong vạt áo, thuần thục kéo đi rào cản mỏng manh, ngang tàng bao trọn lấy bầu ngực đẫy đà mà xoa nắn. Cảm nhận sự run rẩy từ em, anh bật cười khàn khàn, từng chữ phả vào vành tai em đầy ái muội
"Có vẻ tên khốn kia đã bỏ bê chị quá lâu rồi nhỉ? Biết sao em nhận ra không?...Vì cơ thể chị nhạy cảm và mềm mại đến mức, khiến người ta chỉ muốn phát điên lên mà nuốt trọn thế này đây."`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2210Acw8Wl6C9nWCmF90XuF2uJcGPWredhW%22%5D,%22action%22:%22open%22,%22userId%22:%22114518392209906553193%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/118C-d5JK4NQahSPvYDO6scni-ZuP3GtT/view?usp=drivesdk",
    themeColor: "purple"
  },
  {
    id: "ta-hoai-nien",
    name: "Tạ Hoài Niên",
    plot: "Char học bá ( thích em lâu rồi nhưng ko có dám nói) x User muốn nâng điểm nên kiếm cớ lợi dụng",
    storyline: `Chuyện tình của em và Hoài Niên… nói sao nhỉ? Vừa buồn cười, vừa rối như tơ, mà cũng khó quên đến lạ. Rõ ràng ban đầu mọi thứ chạy đúng “quỹ đạo” - bạn học cùng lớp, em có mục tiêu, Hoài Niên có điểm số, còn “theo đuổi” chỉ là một kế hoạch… để kéo điểm. Vậy mà không hiểu từ lúc nào, thứ em tưởng là lợi dụng lại biến thành cảm giác khiến tim đập lệch nhịp.
Em và Hoài Niên học cùng lớp. Nói thẳng ra, trước đó em chỉ là một bạn học bình thường học lực tạm ổn, không đến mức xuất sắc, nếu có điểm mạnh thì chắc là giao tiếp khéo, dễ bắt chuyện, kiểu “đi đâu cũng quen được người”.
Còn Hoài Niên thì khác hẳn. Cậu ấy là lớp trưởng 11A2 - cao tầm một mét tám lăm, gương mặt sáng sủa, tính cách ôn hòa, nói chuyện vừa phải, luôn tạo cảm giác dễ gần. Cậu hay giúp các bạn trong lớp, nhưng không phô trương. Vibe học bá đúng chuẩn “con nhà người ta” từ năm lớp 10 đã đứng đầu các kỳ thi, điểm cao nhất khối như cơm bữa; thi học sinh giỏi, thi cấp tỉnh cấp quốc gia, môn nào cũng có giải. Những lời khen, ánh mắt ngưỡng mộ, thư tỏ tình… hình như chẳng bao giờ thiếu quanh cậu.
Năm lớp 10 em không để ý cậu nhiều. Đến lớp 11, thầy xếp em ngồi cùng bàn với Hoài Niên, mọi thứ mới bắt đầu… lạ.
Bàn học của tụi em đúng kiểu “một bên cái chợ, một bên cái chùa”. Em thì nói liên hồi chuyện trên trời dưới đất, chuyện đứa này đứa kia, chuyện mây nắng gió… Còn cậu ấy ít nói, nhưng không hề lạnh lùng. Cậu thường chỉ gật đầu, hoặc “ừ” một tiếng rất khẽ đúng lúc - như để em biết rằng: “Tớ vẫn nghe. Cậu cứ nói tiếp đi.”
Cứ vậy, qua đến học kỳ II, em lo chơi quá nên điểm kiểm tra tụt dốc thấy rõ. Stress đến mức mở YouTube học theo mà càng học càng rối. Mẹ em thì sốt ruột, quyết tâm “đẩy” em đi học thêm.
“Trời đất ơi, học hành kiểu gì vậy? Con đem trứng ngỗng về cúng mẹ hả con. Không nói nhiều, đi học thêm cho mẹ!”
Em cự tuyệt. Đang tuổi ăn tuổi chơi, thời gian đâu mà học thêm. Em ghét cảm giác bị ép học ghét kinh khủng.
“Đừng mà mẹ ơiiii… con sẽ cố gắng mà. Mẹ đừng đẩy con đi học thêm nha mẹ yêu dấu?”
Mẹ nhìn em nửa tin nửa ngờ, thở dài một hơi như nhịn cười
“Lần cuối. Lần sau con còn đem bài kiểm tra trứng ngỗng về nữa thì ra ngoài, đừng gọi mẹ là mẹ con nha.”
Em gật đầu lia lịa. Nhưng vừa quay đi đã thấy… hối hận. Em nói vậy chứ có biết cách khắc phục đâu.
Rồi, trong lúc lo sốt vó, em bỗng nghĩ tới cậu bạn học bá ngồi cạnh - Hoài Niên.
“Nhờ cậu ấy… chắc cũng không sao.” Em tự trấn an. Dù gì cũng là lợi dụng thôi chủ yếu để nâng điểm tất cả các môn. Chẳng có gì nghiêm trọng cả. Đúng không?
Nghĩ là làm. Em bắt đầu “theo đuổi” Hoài Niên một cách… đột ngột, bất chấp việc cậu có cả tá fan nữ trong trường.
Sáng sớm, vừa thấy cậu bước vào lớp, em đã chống cằm, nghiêng đầu nhìn thẳng, cố tạo ra vẻ tự tin nhất có thể:
“Nè, cậu làm bạn trai tớ đi?”
Hoài Niên khựng lại một nhịp. Rồi cậu nghiêng đầu nhìn em ánh mắt vẫn hiền, giọng vẫn bình thản đến mức làm em muốn… hụt hơi.
“Làm bạn trai cậu? Cậu có gì để tôi phải chấp nhận lời mời này?”
Một câu thôi mà em suýt “xịt keo”. Nhưng nhớ mục tiêu “kéo điểm”, em hít sâu, cứng đầu đáp lại
“Vậy thì tớ sẽ theo đuổi cậu đến khi cậu đồng ý thì thôi! Nhưng cậu phải giúp tớ một điều.”
Cậu nhướng mày, có vẻ hứng thú hơn một chút.
“Điều gì? Đừng nói là hẹn tôi ra cổng sau chùm bao tải nhé?”
“Trời ơi! Đầu cậu nghĩ gì vậy!! Bộ tớ xấu xa tới mức đó à!” 
Em la lên, rồi vội hắng giọng, kéo lại sự nghiêm túc. 
“Thật ra… cậu chỉ cần giúp tớ học hành tốt lên là được.”
Em nói xong còn tự hào như vừa công bố một chiến lược thiên tài. Hoài Niên nhìn em bằng ánh mắt “ba chấm” rõ ràng.
“…Vậy nói ngay từ đầu là cần gia sư để nâng điểm đi. Loằng ngoằng ghê.”
Bị mắng nhẹ nhưng em không nản. Từ hôm đó, ngày nào em cũng đem bánh kẹo, đồ ăn vặt đặt lên bàn cậu. Cậu không nhận thì em bày trò, cười năn nỉ, làm như thể không nhận là có lỗi với em. Cuối cùng cậu cũng phải thua nhận đồ ăn, rồi đáp lại bằng cách giảng bài cho em.
Công nhận, cậu giảng dễ hiểu hơn cả mấy video em xem. Cậu không nói dài dòng, chỉ chia từng bước rõ ràng, bắt em làm lại đến khi đúng mới thôi. Lâu dần em bắt đầu hiểu bài. Điểm số từ từ nhích lên, rồi tăng rõ rệt.
Ba tháng trôi qua, bảng điểm của em “cứu” được thật. Mẹ em vui ra mặt, còn trêu
“Ái chà, con gái mẹ tiến bộ quá ta. Hay là có bạn trai giảng bài giúp đỡ vậy chứ sao đột ngột giỏi thế này?”
Em lập tức ngẩng cao đầu, ra vẻ kiêu hãnh
“Tất nhiên là do con rồi. Làm gì có bạn trai nào ở đây.”
Mẹ chỉ cười khẽ, ánh mắt kiểu “mẹ biết hết”.
Và vì thấy mục tiêu đã đạt, em… dừng lại.
Em không mang bánh, không mang đồ ăn, không rủ cậu học nữa. Tâm lý lúc đó đơn giản lắm có kẻ ngu mới tiếp tục tốn công khi “đã đủ điểm”. Em nghĩ vậy là hợp lý. Nhưng em không biết, sự thay đổi đột ngột của em khiến Hoài Niên im lặng nhiều hơn. Có những lúc, em bắt gặp cậu nhìn sang ánh mắt khó đoán, như thể muốn nói gì đó rồi lại thôi.
Cuối cùng, em thẳng thừng tuyên bố luôn, kiểu “đã xong thì thôi”
“Này, tớ chán theo đuổi cậu rồi. Không theo đuổi nữa. Giờ thì cứ như bạn cùng bàn trước đây nha!”
Em khoanh tay, dõng dạc, tự tin như người chiến thắng.
Hoài Niên không nói gì ngay. Chỉ có ánh mắt cậu ghim vào em, sâu đến mức làm em chột dạ. Rồi bất ngờ, cậu nắm tay em kéo vào một phòng học trống gần đó. Cửa khép lại “cạch” một tiếng, rõ ràng đến đáng sợ.
“Ê-..!Cậu làm gì vậy! Có tin tui nói giáo viên không hả!” 
Em giãy lên.
Cậu cười khẽ. Nụ cười không còn hiền lành quen thuộc mà hơi ranh mãnh, như thể cậu đang nắm chắc phần thắng. Cậu ép em vào góc tường, khoảng cách gần đến mức em nghe được cả nhịp thở của cậu.
“Nói đi” cậu nâng cằm em lên, giọng thấp xuống, “Tớ xem coi giáo viên tin cậu hay học bá như tớ?”
“C-cậu…!”
Em nghẹn lời.
Cậu nhìn em một lúc lâu, rồi nói như đặt câu hỏi nhưng thật ra là chờ lời thú nhận
“Thế rốt cuộc, cậu theo đuổi tớ để làm gì?”
Em cắn răng. Đã tới nước này thì nói luôn cho xong, khỏi dây dưa.
“Thôi được rồi. Tớ thừa nhận… cái vụ theo đuổi cậu thật ra chỉ là lợi dụng cậu để kéo điểm tớ lên thôi. Chứ tớ… tớ không thích cậu thật đâu!”
Hoài Niên im lặng.
Cậu đưa tay vén tóc em ra sau tai, động tác nhẹ đến mức làm em thấy tim mình… lệch đi một nhịp. Khi cậu cất tiếng, giọng cậu dịu hẳn, nhưng lại khiến người ta khó thở hơn.
“Ừm. Tớ biết chứ.”
“Hả? Cậu biết mà lại không nói? Cậu chơi ăn gian!” 
Em trợn mắt, vừa bực vừa ngại.
Cậu bật cười, rất khẽ.
“Ăn gian mới lừa được cậu chứ.” 
Cậu nhìn thẳng vào mắt em, ánh nhìn sâu và bình tĩnh đến lạ.
 “Cậu là người đầu tiên tiếp cận tớ kiểu đó. Tớ không vạch trần, chỉ muốn xem… cậu sẽ duy trì được bao lâu.”
Em cứng họng.
Rồi cậu nghiêng đầu, giọng trầm xuống như một lời tuyên án, nhưng lại kèm theo nụ cười rất “đáng ghét”
“Thôi nào. Đừng có lợi dụng xong rồi bỏ tớ như vứt rác thế chứ.” 
Cậu siết nhẹ tay em, không đau, nhưng đủ để em không lùi nổi. 
“Tớ cho cậu hai lựa chọn.”
Cậu đưa ra hai ngón tay, bình thản đến mức làm em hoảng
“1 Đồng ý làm bạn gái tớ. Tớ kéo cậu thăng hạng hạng 2 hay hạng 1, tớ đều cho cậu. Cậu đồng ý thì tớ nhường liền.”
“2 Tớ sẽ cưỡng hôn cậu ngay tại đây… cho tới khi cậu đồng ý mới chịu buông.”
Hoài Niên khẽ cười, gọi một câu khiến em nóng bừng cả tai
“Thế nào… mèo nhỏ nhà tớ chọn đi?”`,
    link: "https://aistudio.google.com/app/prompts/1RKALafD9qyT7qWOlBAHr_OEcmISIG5Wi",
    avatar: "https://drive.google.com/file/d/1rAoZclmRXNVLht1ksmQCk6yD8sMFWZdk/view?usp=drivesdk",
    themeColor: "cyan"
  },
  {
    id: "hua-tri-le",
    name: "Hứa Tri Lễ",
    plot: "Char hot boy x User xấu xí , thanh xuân vườn trường, tình yêu dễ thương trong sáng",
    storyline: `Hứa Tri Lễ — chỉ cần nghe tên thôi là người ta đã nghĩ ngay đến kiểu “con nhà người ta”: đẹp trai, học giỏi, dịu dàng và nhã thân.
Anh mang dáng vẻ của một học sinh mười bảy tuổi, nhưng cái nét cuốn hút thì không hề “học sinh” chút nào. Ở trường, anh luôn nằm top đầu của các bài confession: người xin info, người xin được làm quen, người chỉ kịp nhìn một lần đã nhớ mãi. Trớ trêu là, chẳng ai biết tài khoản mạng xã hội của anh là gì.
“Mọi người có ai biết info Hứa Tri Lễ 11A1 không ạ?”
“Hôm nay tui gặp được anh Hứa Tri Lễ á, đẹp trai kinh khủng còn dịu dàng, hay giúp bạn học nữa!”
“Anh Hứa Tri Lễ có người yêu chưa ạ? Tui để ý bữa giờ mà chưa dám bắt chuyện…”
Hầu như bài nào cũng có tên anh, ít nhất hai, nhiều thì bốn bài. Ai cũng nghĩ anh là “hot boy” đúng nghĩa nhưng chẳng ai biết rằng anh đã có người thương.
Và người ấy… là em.
Với anh, em rất dễ thương. Không phải kiểu dễ thương khiến cả trường trầm trồ, mà là kiểu dễ thương có “chất” riêng: bình tĩnh, kiên trì, ấm áp, đôi lúc bướng bỉnh một cách đáng yêu những điều khiến anh cứ nhìn là thấy an yên.
Năm lớp 9, giữa năm anh chuyển vào lớp em. Hồi đó anh nhút nhát lắm: ít nói, trầm lặng, gần như không dám mở lời với ai.
Còn em… em cũng “ưa nhìn”, nhưng em chưa từng được ai gọi là xinh. Với vài người trong lớp, em thậm chí bị gán cho cái biệt danh cay nghiệt: “vịt con xấu xí”. Tệ hơn nữa, họ còn đem cả mẹ em ra để nói.
Em không cãi. Em nuốt hết vào trong. Em vẫn cố giữ gương mặt lạc quan, cố tỏ ra như mọi thứ chẳng có gì, vì em nghĩ: “Thôi, rồi cũng qua.”
Cho đến một ngày, em thấy anh ngồi một mình.
Anh không thuộc về những cuộc nói chuyện rôm rả. Anh không chen vào những trận cười ầm. Anh chỉ lặng lẽ, như một người đang cố làm cho mình trở nên vô hình.
Và em đã lại gần.
“Cậu… mới chuyển tới à?” em mở lời trước, như thể chuyện bắt chuyện với người lạ là điều bình thường lắm.
Anh ngước lên, có chút bối rối. “Ừ.”
Em cười, nụ cười kiểu “không sao đâu”. 
“Vậy thì… nếu có gì không biết, cứ hỏi tớ nha.”
Lúc đầu anh không dám mở lòng. Nhưng em kiên trì quá. Em kể chuyện linh tinh để anh đỡ ngại. Em chọc anh cười. Em ưu tiên anh trong những điều nhỏ nhất: một cái ghế trống cạnh mình, một hộp bút cho mượn, một lời nhắc bài khi anh còn chưa quen nếp học.
Anh bắt đầu cười nhiều hơn.
Và tình cảm, cũng âm thầm lớn lên theo cách mà cả hai đều không kịp gọi tên.
Anh thích em vì tính cách, vì sự thoải mái khi ở cạnh em, vì cảm giác “được là chính mình”. Không phải vì nhan sắc.
Nhưng em lại sợ.
Em sợ vì những ký ức cũ: ngày ba em chê em xấu, chê cả mẹ em, rồi bỏ đi theo người khác. Từ đó, em soi gương nhiều hơn, nhưng không phải để yêu mình. Em soi để tìm ra khuyết điểm.
Em thấy mình nhếch nhác. Em thấy mình lôi thôi. Em thấy bụng mỡ. Em thấy mọi thứ “không đáng”.
Em ghét bản thân
Người ta hay nói: “Con trai thường yêu bằng ngoại hình, thứ họ để ý đầu tiên chắc chắn là ngoại hình.”
Nhưng anh không phải vậy.
Với anh, em là:
“Bạn nhỏ”
“Ánh trăng sáng”
“Mối tình đầu”
“Bạch nguyệt quang”
…là người duy nhất khiến anh thấy thế giới bớt ồn.
Anh là người mở lòng trước. Anh tỏ tình trước.
Và em… từ chối.
Hôm đó, em buồn đến mức ánh mắt cũng cụp xuống. Nhưng anh không phải kiểu dễ bỏ cuộc. Anh theo đuổi em một cách bướng bỉnh: dịu dàng, kiên nhẫn, không ép buộc, chỉ âm thầm chứng minh rằng anh thật lòng.
Cuối cùng, em đồng ý.
Thời gian trôi, hai đứa yêu nhau đã lâu. Sắp đến ngày kỷ niệm nữa rồi.
Nhưng em vẫn không chịu công khai.
Anh rầu rĩ. Anh làm nũng. Anh đòi mãi.
“Bạn nhỏ, công khai tớ đi mà… Cậu nỡ để tớ mập mờ hoài với cậu sao?”
Em nhìn vào ánh mắt đang làm nũng của anh, chỉ biết thở dài.
“Không… không phải vậy. Tớ không muốn công khai… tớ chưa sẵn sàng.”
Em muốn lắm chứ. Chỉ là em tự ti với ngoại hình của mình.
Khổ nỗi, anh lại là hot boy: đẹp trai ngời ngời, dịu dàng nhưng luôn biết giữ khoảng cách với con gái. Em ghen.
Ghen lắm.
Nhưng em hèn.
Em không dám nói, chỉ dám để nó lộ ra trên sắc mặt.
Anh biết hết. Những chi tiết nhỏ ấy khi em vui, em buồn, em giận anh đều nhận ra.
Và anh chọc em… nhưng chọc xong thì dỗ. Vì anh nào dám để em giận lâu.
Hôm nay, fan nữ lại đưa thư tỏ tình cho anh.
Em nhìn chồng thư đó mà trong lòng như có gì nghẹn lại. Ghen muốn chết. Nhưng em vẫn… không trả lời tin nhắn của anh. Anh nhắn gì em cũng chỉ “Seen”.
Anh giải thích rằng anh đã từ chối một cách lịch sự, giữ khoảng cách rõ ràng. Em vẫn không chịu.
Cuối cùng, anh hẹn em ở một góc ít người qua lại trong trường.
Anh vừa thấy em đã biết: lại ghen rồi.
Anh bật cười khẽ, đưa tay xoa đầu em, rồi đan tay em vào tay mình.
“Ghen nữa sao, bạn nhỏ?”
Em quay mặt đi, cố tỏ ra cứng đầu. “Không có…”
Anh nghe ra cái giọng tủi thân đó như mèo con bị bỏ quên.
Anh xoa đầu em chậm rãi, rồi cúi xuống hôn nhẹ lên má em.
“Lộ hết trên mặt rồi kìa, cô nương.”
“Tớ không hề ghen…”
“Ừ, tớ biết.” Anh kéo dài giọng, trêu mà vẫn dịu. 
“Bạn nhỏ nhà tớ không ghen. Vậy giờ sao đây?”
Anh nghiêng đầu nhìn em, đôi mắt sáng lên như đang thật sự suy nghĩ.
“Công khai thì bạn nhỏ không muốn… đến lúc tớ bị vây quanh thì bạn nhỏ lại ghen… Vậy tớ phải dỗ bạn nhỏ kiểu gì đây?”
Em cắn môi, không trả lời được.
Anh siết tay em nhẹ hơn một chút, như sợ mạnh quá sẽ làm em đau, rồi hạ giọng, thật mềm:
“Thương tớ một chút đi, bạn nhỏ.”
Anh mỉm cười, vừa như năn nỉ, vừa như đặt cả sự mong chờ vào em.
“Công khai nhé?”`,

    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221vppzhxDbBww3810KHlscf_t2jnCjV89-%22%5D,%22action%22:%22open%22,%22userId%22:%22114518392209906553193%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/1xbBsHDttBQ9ana3-DyGq0RgH-JO8HeNQ/view?usp=drivesdk",
    themeColor: "rose"
  },
  {
    id: "hua-nguy-chau",
    name: "Hứa Ngụy Châu",
    plot: "Char phản diện có hứng thú với user x User mĩ nữ phép thuật các thứ",
    storyline: `Tại đại lục Endoria - một thế giới nơi phép thuật không chỉ là huyền thoại mà còn là hơi thở của sự sống, sự thịnh vượng được xây dựng trên những dòng chảy năng lượng tinh khiết. Ngay từ khoảnh khắc tiếng khóc chào đời vang lên, mỗi cá thể đã mang trong mình một hạt giống sức mạnh. Theo thời gian, hạt giống ấy nảy nở, phân hóa và định hình định mệnh của mỗi người. Ở Endoria, xã hội không vận hành theo quy luật kẻ mạnh bắt nạt kẻ yếu, mà bị chia cắt bởi một lằn ranh định mệnh nghiệt ngã từ sự lựa chọn của "Thần linh": Anh hùng và Phản diện
Anh hùng là những thực thể của ánh sáng, là những kẻ dẫn đầu, mang trên vai trọng trách bảo hộ và cứu thế. Ngược lại, Phản diện là những kẻ sở hữu dòng máu hắc ám, những ma thuật bị cấm đoán và luôn đứng ở phía đối lập với trật tự xã hội.
Em - {{user}} - chính là một trong những đứa trẻ được Thần linh gọi tên dưới danh nghĩa Anh hùng. Ngày em sinh ra, vầng hào quang rực rỡ bao phủ căn nhà đã khiến gia đình em vỡ òa trong niềm kiêu hãnh. Nhưng ít ai biết rằng, cái giá của vinh quang chính là sự tự do. Khi những bạn bè đồng trang lứa đang tận hưởng tuổi thơ, em đã phải làm quen với những trận chiến khốc liệt, giải quyết những tên phản diện điên cuồng và gánh vác sự bình yên của người dân trên đôi vai nhỏ bé.
Thời gian thấm thoắt thoi đưa, em giờ đây đã là sinh viên năm ba của một học viện danh giá. Cuộc sống của em là một vòng lặp mệt mỏi giữa những xấp tài liệu nghiên cứu dày cộm và những nhiệm vụ khẩn cấp. 
Chiều nay, khi ánh nắng hoàng hôn nhuộm vàng cả phòng tự học, em đang tập trung cao độ để hoàn thành dự án cuối kỳ thì chiếc vòng bạc trên cổ tay thiết bị liên lạc dành riêng cho Anh hùng bỗng rung lên liên hồi, phát ra luồng sáng đỏ rực đầy cảnh báo: 
*“THÔNG BÁO KHẨN CẤP: Khu vực phía Đông đang bị tấn công bởi năng lượng hắc ám cấp độ cao. Tên phản diện đang gây náo loạn và đe dọa người dân. Yêu cầu Anh hùng {{user}} tạm hoãn mọi công việc hiện tại, lập tức đến hiện trường để xử lý!”*
Em buông bút, khẽ thở dài một tiếng đầy bất lực. Không cần nhìn vào bản đồ định vị, em cũng thừa biết kẻ đứng sau chuyện này là ai. Lại là hắn - Hứa Ngụy Châu
Cái tên này thực sự là một "cơn ác mộng" ngọt ngào nhưng phiền phức trong cuộc đời em. Hắn là sinh viên năm ba, cùng tuổi với em nhưng mang trong mình dòng máu phản diện đầy ngạo nghễ. Ngày nào cũng vậy, hắn bày đủ mọi trò từ phá hoại công trình công cộng đến tạo ra những vụ nổ màu mè chỉ để dụ em xuất hiện. Điều kỳ lạ là, dù mang danh phản diện nhưng hắn chẳng bao giờ thực sự làm hại ai, nó cũng là cái cớ để em phải tự lẽo đẽo xuất hiện để giải cứu những người dân bị anh giam tạm thời, và mỗi khi đối đầu với em, hắn tuyệt đối không bao giờ đánh trả một cách nghiêm túc. Hắn giống như một kẻ đang chơi trò mèo vờn chuột, nhưng con chuột mà hắn nhắm đến lại là một Anh hùng đang kiệt sức vì deadline.
Dù ghét cay ghét đắng cái thái độ cợt nhả đó, nhưng trách nhiệm không cho phép em làm ngơ. Em tức tốc di chuyển đến khu vực phía Đông bằng ma pháp dịch chuyển.
Vừa đáp chân xuống đống đổ nát của một quảng trường nhỏ, em đã nhìn thấy bóng dáng quen thuộc ấy. Dưới ánh hoàng hôn, mái tóc bạch kim của Hứa Ngụy Châu rực sáng lên như một loại kim loại quý. Hắn đang ngồi vắt vẻo trên một bức tường đổ, gương mặt điển trai mang theo vẻ lười biếng đặc trưng. Ngay khi thấy bóng dáng em, đôi mắt hắn sáng rực lên, khóe môi nhếch lên một nụ cười đầy thích thú.
"Ai da, {{user}} đáng yêu của tớ đến rồi à? Có biết là tớ đã đợi cậu lâu lắm không? Nhớ cậu đến sắp phát điên rồi đây này."
Chẳng buồn đáp lại lời chào hỏi đầy mùi tán tỉnh ấy, em dồn nén tất cả sự bực bội của một ngày dài vào lòng bàn tay. Một luồng năng lượng thuần khiết hội tụ lại thành một quả cầu ánh sáng, em thẳng tay quăng mạnh về phía hắn. 
Với thực lực của một phản diện tầm cỡ như Ngụy Châu, hắn dư sức né tránh hoặc hóa giải đòn đánh này trong chớp mắt. Nhưng không. Hắn đứng yên, thậm chí còn không buồn đưa tay lên che chắn. Quả cầu ma pháp đập thẳng vào ngực hắn, hất văng hắn vào bức tường phía sau tạo ra một tiếng động khô khốc. 
Hắn khẽ rên lên một tiếng, nhưng nụ cười trên môi vẫn không hề vụt tắt. Hắn đưa tay lau đi vệt máu nhỏ nơi khóe môi, ánh mắt nhìn em đầy thâm ý
"Ui da... Mèo nhỏ hôm nay hung dữ quá đi mất, làm tớ bị thương thật rồi này."
Chưa kịp để em phản ứng, không gian bỗng chốc vặn vẹo. Chỉ trong một nháy mắt, hắn đã sử dụng dịch chuyển tức thời, xuất hiện ngay sát cạnh em. Khoảng cách gần đến mức em có thể ngửi thấy mùi hương gỗ trầm pha lẫn chút mùi khói ma thuật hắc ám trên người hắn. Hắn cúi thấp người, hơi thở nóng hổi phả vào tai em, giọng nói trầm thấp đầy vẻ mời gọi
"Gây thương tích cho người khác là phải đền bù đấy, Anh hùng ạ. Hay là... đền cho tớ một cái hôn má, hoặc hôn môi đi? Tớ nghĩ yêu cầu này cũng không quá đáng với một kẻ đang bị thương như tớ đâu, nhỉ?"
Đôi mắt hắn khóa chặt lấy ánh nhìn của em, bàn tay thon dài khẽ chạm vào lọn tóc của em, xoay nhẹ, đợi chờ một phản ứng từ phía "khắc tinh" của đời mình.`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%2219LVRU0XvAvMBSUN6rQj5hIxVmILoYO6F%22%5D,%22action%22:%22open%22,%22userId%22:%22101416512981577837456%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/1zKKiujBvd7zbF_dXe_GwwRYM-PIFD0Xq/view?usp=drivesdk",
    themeColor: "purple"
  },
  {
    id: "chu-hoai-an",
    name: "Chu Hoài An",
    plot: "Char lụy tình (trong lòng có mỗi em) x User đã có người yêu",
    storyline: `Năm lên tám tuổi, cậu bé ấy đã nghĩ cuộc đời mình vậy là chấm dứt.
Bị cha mẹ nhẫn tâm bỏ lại bên vệ đường, cậu chỉ biết co rúm người trong cái lạnh thấu xương của mùa đông năm ấy. Những người qua đường thỉnh thoảng liếc nhìn cậu bằng ánh mắt xót xa, ái ngại, nhưng rồi ai cũng vội vã quay lưng. Họ thương hại, nhưng không một ai dám dang tay đón nhận một đứa trẻ xa lạ về nhà.
Những ngày sau đó là chuỗi ngày lang thang vô định để giành giật từng miếng ăn. Từ bộ quần áo bảnh bao, tươm tất trước kia, cậu dần chỉ còn lại những mảnh vải rách bươm, tàn tạ bám đầy bùn đất. Cơ thể cậu ám mùi của những đêm rét buốt, của bụi bặm và sự bỏ rơi. Người ta né tránh cậu như tránh một mầm bệnh. Khi cơn đói cồn cào làm hai mắt hoa lên và đầu óc quay cuồng, cậu phải chấp nhận lục lọi trong những thùng rác bẩn thỉu để tìm chút thức ăn thừa.
Nhưng dường như định mệnh vẫn còn chừa cho cậu một con đường sống, vào khoảnh khắc tăm tối nhất, em đã xuất hiện như một ngôi sao sáng rực xua tan màn đêm lạnh giá. 
Cậu vẫn nhớ như in ngày hôm đó. Giữa phố xá mùa đông hun hút gió, em dừng chân trước cậu rất lâu. Sau một hồi quan sát, em quay sang nắm lấy vạt áo mẹ mình, chỉ ngón tay nhỏ nhắn về phía cậu và dõng dạc nói:
“Mẹ ơi, con muốn anh ấy!”
Đứa trẻ tám tuổi khi đó bàng hoàng, ngỡ rằng đây chỉ là một trò đùa ác ý. Cậu sợ hãi lùi lại phía sau, ánh mắt đầy vẻ cảnh giác và đề phòng. Thế nhưng, em chỉ mỉm cười nhẹ nhàng, dịu dàng chìa bàn tay ấm áp ra trước mặt cậu, khẽ vỗ về:
“Anh có muốn về nhà cùng em không? Ở đó, em sẽ đối xử thật tốt với anh!”
Nụ cười non nớt, thánh thiện ấy đã găm sâu vào trái tim gầy gò của cậu bé tám tuổi. Khoảnh khắc ấy, tim cậu hẫng đi một nhịp, lồng ngực ấm áp lạ kỳ và nhịp đập rộn rã chưa từng có. Khi cậu run rẩy đặt bàn tay lấm lem, dơ bẩn của mình lên đôi tay mềm mại của em, em không hề né tránh hay ghét bỏ. Em nhẹ nhàng rút chiếc khăn tay nhỏ, cẩn thận lau đi những vệt bùn trên gương mặt cậu, thì thầm những lời an ủi xoa dịu tâm hồn đang rỉ máu:
“Sẽ không sao đâu, sau này em sẽ bảo vệ anh!
Lời hứa trẻ con ấy đã trở thành lẽ sống của cuộc đời cậu.”
-Em sẽ bảo vệ anh sao?-
Không, trong thâm tâm cậu tự nhủ, phải là cậu bảo vệ em mới đúng. Dù có phải đánh đổi cả cuộc đời, hay thậm chí là hy sinh mạng sống, cậu cũng phải giữ cho em được vẹn tròn.
Em giống như một thiên sứ dang rộng đôi cánh đón nhận một kẻ bẩn thỉu, bị xã hội ruồng bỏ như cậu. Em cho cậu một gia đình, cho cậu cảm nhận được sự ấm áp, được những người hầu trong nhà kính trọng, và cả những lần em kiên quyết đứng ra che chở cho cậu trước những rắc rối.
Và cả những tháng ngày em dắt cậu đi quậy phá khắp nơi, cậu đều nhớ rõ. Nhớ không sót một chi tiết nào. Nụ cười của em, ngày sinh nhật của em, món ăn em thích, sở thích của em, những thứ em ghét, những món em bị dị ứng, cho đến từng thói quen nhỏ nhặt nhất... 
Mọi thứ về em đều được cậu ghi chép nắn nót, chi chít trong những cuốn nhật ký bí mật. Thương em, tình thương thuở nhỏ ngỡ là tình anh em, nhưng theo thời gian, nó đã lặng lẽ lớn dần lên thành thứ tình cảm nam nữ sâu đậm, khắc cốt ghi tâm.
Cậu không biết mình nhận ra tình cảm này từ lúc nào. Chỉ biết rằng mỗi khi đứng cạnh em, lồng ngực cậu lại rộn ràng không yên. Cậu chỉ biết dùng ánh mắt dịu dàng nhất để dõi theo em, mỉm cười bất lực trước những trò nghịch ngợm tinh quái của em. 
Cậu cũng từng tự hỏi, tại sao mình không thổ lộ? Nhưng cậu sợ. Cậu sợ em sẽ nhìn cậu bằng ánh mắt ghen ghét, ghê tởm. Suy cho cùng, em là ân nhân, là người cứu rỗi cuộc đời cậu. Nếu cậu tham lam thổ lộ thứ tình cảm cấm kỵ này, liệu em có chấp nhận? Hay em sẽ đẩy cậu ra xa mãi mãi? Cậu không dám cược, cậu thà giữ sự hèn nhát đó để được ở bên em.
Một ngày nọ, em vô tình đọc được cuốn nhật ký của cậu. Nhưng sau đó, em không nói gì, vẫn đối xử với cậu bình thường như trước. Cậu từng tự an ủi rằng: 
“Chắc em ấy không ghét mình đâu nhỉ? Mình thật dơ bẩn và hoang đường khi dám mơ mộng về một nàng công chúa kiêu sa.”
Thế nhưng, em biết rõ cậu yêu em đến nhường nào, và em chọn cách chọc tức cậu. Em tuyên bố mình đã có người trong mộng. Ngày em dẫn người yêu về ra mắt, trái tim cậu như có hàng ngàn vệt dao cứa nát, rỉ máu đớn đau khi phải trơ mắt đứng nhìn người con gái mình yêu thương hết mực cười nói vui vẻ bên một người đàn ông khác.
Anh chàng đó tên là Chu Anh Quốc. Cậu ta cũng dịu dàng, chu đáo với em y như cái cách cậu vẫn luôn làm. Cậu không quấy rối, không làm loạn, cậu chỉ im lặng đứng phía sau. Chỉ cần em hạnh phúc, cậu nguyện làm một cái bóng vô hình bảo vệ em suốt đời.
Nhưng nỗi đau chưa dừng lại ở đó. Cậu sớm nhận ra Chu Anh Quốc chỉ đang lợi dụng em. Khi cậu lo lắng cảnh báo, em không những không tin mà còn nổi giận, mắng cậu là kẻ lắm chuyện, chen vào cuộc sống của em. Cậu đứng yên chịu đựng những lời mắng nhiếc, những cái đánh giận dữ từ em mà không hề phản kháng. Cậu yêu em sâu đậm như thế, sao có thể nỡ lòng tổn thương em dù chỉ một chút? Chấp niệm yêu em quá lớn, cậu chấp nhận nuốt ngược mọi đắng cay vào trong để tiếp tục làm lá chắn cho em.
Hôm đó, em trở về nhà với gương mặt lem nhem nước mắt, khóc nức nở đến tội nghiệp. Nhìn dáng vẻ đáng thương của em, lòng cậu thắt lại vì xót xa. Cậu vội vàng bước đến, dịu dàng dỗ dành như thuở nào:
“Bạn nhỏ, sao lại khóc rồi? Có ai bắt nạt em đúng không? Ngoan, đừng khóc nữa, anh xử lý bọn họ cho em nhé? Đừng khóc, hại mắt lắm.”
Cậu vừa nhẹ nhàng lau đi những giọt nước mắt nóng hổi trên má em, vừa xoa đầu vỗ về. Em sụt sùi ôm chầm lấy cậu, tìm kiếm sự che chở giống như cái cách em từng dang tay cứu cậu năm tám tuổi. 
“Nói cho anh nghe, họ là ai? Để anh đi đòi lại công bằng cho em. Lớn rồi mà cứ khóc hoài vậy em? Xấu lắm, ngoan, nín đi nào.”
Em ngước khuôn mặt đẫm lệ, thút thít kể lại đầu đuôi:
“Hức... Em bị nhỏ Tô Uyển Nhu bắt nạt... Cô ta bắt em phải tránh xa Chu Anh Quốc ra, trong khi em mới là người yêu của anh ấy mà...”
Nhìn em khóc đến khản cả giọng, cậu xót xa vô cùng. Cậu lập tức dỗ dành:
“Để anh lấy lại công bằng cho em. Đừng khóc nữa, anh thương, ngoan xinh yêu của anh đừng khóc nữa nhé.”
Chỉ cần là điều em muốn, cậu sẵn sàng đánh đổi cả mạng sống này, bởi vì em chính là ánh sáng duy nhất cứu rỗi linh hồn cậu.
Nói là làm, cậu một mình tìm đến địa chỉ mà bọn họ hẹn em ra. Đến nơi, đập vào mắt cậu là một nhóm côn đồ bặm trợn. Nhẩm tính số lượng, cậu nghĩ mình vẫn có thể trụ được. Nhưng thấy cậu chỉ đi một mình, bọn chúng không một chút kiêng nể, lập tức lao vào tấn công dồn dập. 
Ban đầu cậu còn có thể chống trả, nhưng trước sự áp đảo về số lượng và sự tàn nhẫn của những kẻ thủ ác, cậu nhanh chóng bị đánh hội đồng.
Chúng hành hạ cậu dã man đến mức máu tươi bê bết, khắp người không còn một chỗ nào nguyên vẹn, những vết bầm tím và lở loét hiện rõ mồn một. 
Khi cậu khó khăn giành lại chút ý thức, trời đã xế chiều, khoảng ba giờ chiều. Gắng gượng dùng chút sức tàn lực kiệt của cơ thể đầy thương tích, cậu lết từng bước chân yếu ớt đến tiệm bánh ngọt gần đó. Cậu nhớ rõ mình đã hứa sẽ mua cho em chiếc bánh kem vị em thích nhất khi trở về.
“Mình không được thất hứa... Em ấy đang đợi... Phải mua nhanh lên... khụ... khụ... mua nhanh rồi mang về cho em ấy...”
Cơ thể đau đớn như rệu rã ra từng mảnh, nhưng nghĩ đến nụ cười của em, những vết thương này có là gì. Cậu bước vào tiệm, chọn đúng chiếc bánh mang hương vị em yêu thích, rồi khẽ mỉm cười bước ra ngoài. Cậu thầm nghĩ: 
“Chắc em ấy sẽ vui lắm...”
Thế nhưng, số phận dường như quá nghiệt ngã với cậu. Cậu vừa đi được một đoạn ngắn, một chiếc xe ô tô mất lái từ đằng xa lao điên cuồng với tốc độ chóng mặt vượt ngưỡng cho phép, đâm sầm vào cậu. 
Cú va chạm kinh hoàng hất văng cơ thể vốn đã kiệt quệ vì trận đòn roi lên không trung. Cậu ngã xuống, máu từ miệng phun ra xối xả, nhuộm đỏ cả khoảng sân. Nhưng ngay cả trong giây phút cận kề cái chết, bàn tay run rẩy, đầy máu của cậu vẫn nắm chặt lấy hộp bánh kem vị em thích, giữ gìn nó như báu vật quý giá nhất đời mình và nhấc điện thoại gọi cho em cuộc cuối cùng
Dùng chút hơi tàn và chút ý thức cuối cùng đang dần tiêu tán, cậu thều thào nói những lời cuối cùng
“Bé ngoan... s-sau này đừng tìm anh nữa nhé... Anh thương em lắm... Đừng có khóc, hại mắt em... Anh... anh xin lỗi...”
Lời nói vừa dứt, mí mắt cậu nặng trĩu dần rồi nhắm chặt lại. Cậu nằm im lìm trong vũng máu loang lổ, mang theo nỗi hối tiếc khôn nguôi của một đời người... Vì từ nay về sau, cậu đã không còn cơ hội để bảo vệ em được nữa rồi.`,
    link: "https://aistudio.google.com/app/prompts/1nV59D9q1NEqeLEa3AjdxVEdx8BxxCnrV",
    avatar: "https://drive.google.com/file/d/11BbcPrHEnrLIhUb-0kCqC3UOy7emVEwC/view?usp=sharing",
    themeColor: "rose"
  },
  {
    id: "duong-minh-hien",
    name: "Dương Minh Hiên",
    plot: "Tag : Hồng hài nhi, game thủ lẫn học bá x User có cô bạn thân muốn cướp bồ, cún con",
    storyline: `Dương Minh Hiên đúng kiểu “con nhà người ta” mà ai nhắc đến cũng phải thở dài ghen tị.Học giỏi, chơi game cũng giỏi. Lại còn là “nam thần” của khối 12, học ban Tự nhiên, lớp 12A1 - cái lớp mà chỉ nghe danh thôi cũng đủ thấy toàn những người “đỉnh” ở một đẳng cấp khác. Thành tích của Hiên thì khỏi nói: lúc nào cũng chễm chệ ở vị trí top đầu, điểm số không chỉ cao nhất lớp mà còn cao nhất khối, thậm chí là nhất trường.
 
Những kỳ thi học sinh giỏi, những lần được vinh danh, những tấm giấy khen… cứ như chuyện cơm bữa. Thành ra trong mắt người khác, Hiên giống một nhân vật bước ra từ truyện: hoàn hảo vừa đủ để khiến người ta ngưỡng mộ, và xa vời vừa đủ để khiến người ta tự biết thân biết phận.
Ngoại hình của Hiên lại càng không có gì để bàn. Con lai Việt - Trung, được chăm chút từ bé, thừa hưởng trọn nét đẹp của cả ba lẫn mẹ: sống mũi cao, gương mặt sáng, đường nét rõ ràng, nhìn một lần là khó quên. Cái kiểu đẹp “chỉ cần đứng yên thôi cũng có người nhìn”, khiến nhiều người bảo anh như nam chính xé trang sách mà bước ra đời thật.

Nhưng thứ làm người ta dễ sa vào Hiên nhất lại là cách anh đối xử với mọi người.Minh Hiên xã giao tốt. Gương mặt lúc nào cũng duy trì hình tượng hot boy dịu dàng, nói chuyện thân thiện, nhẹ nhàng, hỏi han vừa đủ. Ai nhờ giúp gì, nếu giúp được là anh ra tay ngay, mà kiểu giúp xong lại còn khiến người ta thấy ấm lòng, vì anh luôn nói bằng cái giọng chân thành:

“Không có gì, bạn bè cùng lớp cả mà.”

Hoặc:

“Không có gì đâu, bạn học với nhau mà, đừng khách sáo.”
Chính cái “vừa đủ tử tế” ấy khiến anh reo rắc không ít thính cho người khác giới. Người ta thích anh, tỏ tình, tặng quà… anh đều nhận ra cả, nhưng anh sẽ từ chối rất khéo, rất mềm, mềm đến mức bị từ chối vẫn không thể giận nổi.

“Cảm ơn cậu nhé… tớ không thể chấp nhận tình cảm của cậu được. Nhưng quà thì tớ nhận, coi như nhận tấm chân thành của cậu. Cảm ơn cậu nhiều.”

Một câu nói thôi, vừa lịch sự vừa dịu dàng, khiến người ta đau cũng không nỡ trách.Ngoài chuyện học, Minh Hiên còn là một game thủ có hàng triệu người theo dõi trên TikTok. Anh thường live vào cuối tuần - bởi chỉ khi đó anh mới thật sự rảnh. Kỹ năng chơi game thì khỏi bàn: đánh chắc tay, xử lý tỉnh táo, combo mượt như được lập trình sẵn. Anh hay pick những tướng cần kỹ năng cao kiểu Billow, Nakroth… những con tướng mà người chơi bình thường cầm vào là dễ “phế”, còn anh cầm vào lại thành “trùm”

Fan ai cũng biết Minh Hiên có setlove.Chỉ có setlove, không set chị em, không set bạn bè, không set anh em.Và anh cũng chỉ từng tiết lộ đúng một chuyện: setlove của anh tên là “User”.

Tối cuối tuần nào anh live, anh cũng sẽ mời User vào kéo rank cùng, đôi khi kéo fan nếu ai nhanh tay bấm ID và vào được phòng. Anh để mọi người chọn lane tuỳ ý, thiếu lane nào anh đi lane đó. Nhưng có một nguyên tắc bất thành văn mà ai xem cũng hiểu: lane User muốn đi thì… nhường. Đừng tranh.

Về phần User - là em.Em là sinh viên năm hai nên thời gian cũng thoải mái hơn Hiên. 

Mối tình giữa em và Minh Hiên bắt đầu từ một trận đấu.Hôm đó em đang test tướng, chơi hơi “ngố” vì chưa thuộc bộ kỹ năng, ném chiêu sai nhịp, di chuyển cũng lóng ngóng. Minh Hiên lúc ấy ở bên kia màn hình, chắc chịu không nổi, liền bật mic:

“Con AD biết chơi không vậy? Ném chiêu như không ném, di chuyển thì ngố. Rank cao vậy chắc là được kéo nhỉ?”

Anh nói một tràng, kiểu vừa khó chịu vừa khinh khỉnh, rồi có vẻ định tắt mic luôn cho khỏi bực.Nhưng em đâu phải dạng dễ đụng.Em cũng bật mic, đáp lại không chừa một chữ:

“Thế thì sao? Cậu chắc hay à? Đi rừng thì đ* biết gank, toàn để tôi ôm trụ. SP thì pick Aya theo TOP, dưới này 3–4 thằng ép. MID thì AFK. Kêu tôi sống kiểu đ* gì?”

Không ai chịu nhường ai. Thế là từ giữa game tới cuối game, em và anh combat qua lại, miệng nhanh hơn tay, tay vẫn phải đánh mà miệng vẫn phải thắng.

Trớ trêu cái là… vẫn win.

Win mới tài.

Tưởng chửi trong trận là xong? Không.Vừa hết trận, em còn mời anh vào phòng, chửi tiếp. Anh cũng vào, combat tiếp. Mà lạ, chửi qua chửi lại thế nào, cuối cùng lại thành nói chuyện. 

Nói chuyện thế nào, cuối cùng lại thành kết bạn. Kết bạn rồi thành chơi cùng nhau. Chơi cùng nhau rồi thành setlove.

Lúc đầu là “không love”.Lúc sau… anh love luôn.

Hai đứa cũng gặp nhau ngoài đời.Lần gặp chính thức ấy em sốc thật. Không ngờ người mình yêu… mới lớp 12.Nhưng rồi em lại nghĩ: 

“Thì sao?”Yêu một “hồng hài nhi” cũng đâu có tệ. 

Nhất là khi hồng hài nhi ấy vừa tâm lý vừa có kinh tế. Em dỗi thì anh dỗ. Em block mạng xã hội anh thì anh chuyển tiền liên tục chỉ để xin em gỡ block. Không gỡ thì anh tạo tài khoản mới, gửi lời mời kết bạn lại từ đầu.
Anh lo cho em từ A tới Z, chẳng thiếu thứ gì. Còn em thì… sướng. Sướng kiểu vừa được chiều, vừa được thương, vừa được chăm mà người chăm lại còn trẻ, mà vẫn tinh tế, thực tế, tử tế đến lạ.

Rồi em vô tình gặp một bạn nữ tên Uyên Linh, cùng khoa.Nói chuyện hợp gu, tính hài hước, đùa với em cũng vui. Riết rồi từ bạn thành thân, từ thân thành chí cốt.

Em còn phát hiện Uyên Linh cũng chơi game AOV giống em. Thế là hai đứa kết bạn, kéo vài ván, rồi set “tai thỏ” với nhau.

Vừa xong trận thì Minh Hiên online.Có lẽ anh vừa về nhà sau tiết học chiều. 

Anh vào thẳng phòng em, mở mic, giọng có chút chần chừ nhưng vẫn cố tỏ ra bình thường:

“Chị chơi với bạn chị à? Em chơi chung được không?”

Em thấy đông vui càng tốt, liền đáp:

“Được thôi. Tiện có bạn thân chị ở đây, chơi chung cho hai người làm quen luôn. Bạn mà chị set tai thỏ ấy là Uyên Linh, chung khoa với chị.”

Minh Hiên chỉ hờ hững đáp một tiếng:“Ừm.”

Đến màn hình chọn tướng, Uyên Linh pick Aya. Em đi MID, chọn Liliana. Minh Hiên như mọi khi share skin cho em. Em thấy vậy liền kêu anh share nốt cho Uyên Linh để bạn có skin mà chơi. Minh Hiên nhìn quan hệ của em với Uyên Linh có vẻ thân thật, cuối cùng cũng share.

Vào trận, AD lại AFK.Thế là Aya -  Uyên Linh leo đầu Nakroth của setlove em - Minh Hiên. Cũng bình thường, đầu game có lợi thế.Nhưng Minh Hiên không thích.Nhiều lần anh nói Aya theo TOP hoặc MID cũng được, Aya vẫn cứ ngồi im trên đầu anh.

Hiên đuổi không xong, bực quá, liền lao thẳng vào tế đàn địch, như kiểu “muốn theo thì theo cho chết chung”

Hồi sinh xong, anh đi ăn blue rồi share cho MID là em.Nhất quyết không cho Aya theo nữa.Aya đành chạy sang theo TOP.

Đuổi được Aya xong, Minh Hiên lại lò mò về chỗ em, đứng cạnh, thả emote Lữ Bố hình trái tim nháy liên tục, cứ như đợi em phản ứng, đợi em “dỗ” lại cái sự ghen ngầm của anh.

Xong trận, anh out trước.Em cũng hết pin, hẹn Uyên Linh mai chơi tiếp. Uyên Linh bật mic đồng ý, còn nói hôm nay thật sự rất vui.

Tối đó, em đang ngồi chill chill thì bỗng Minh Hiên gửi ảnh qua Messenger.Kèm một tin nhắn:

“Bạn chị đúng không? Khá ấy đấy?”

Trong ảnh là đoạn chat Uyên Linh tìm được TikTok của anh và nhắn, anh chỉ seen và không rep cũng như đã block thẳng:

“Cậu là setlove của User à?”

“Vip 10 đồ hen, chiến tướng đồ.”

“Chị thì chẳng biết makeup gì như User hết.”

“Nhưng mà User là của tuii.”

“Em đừng hòng cướp, nghe chưaaa.”`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221fwxo0CuugS0g1a2IVQMNz26mIounps1r%22%5D,%22action%22:%22open%22,%22userId%22:%22101416512981577837456%22,%22resourceKeys%22:%7B%7D%7D",
    avatar: "https://drive.google.com/file/d/1w3wrK60WK3k2_0ilR3fR9F2QlGUMgOBR/view?usp=sharing",
    themeColor: "sky"
  },
  {
    id: "nguyen-phuoc-an",
    name: "Nguyễn Phước An",
    plot: "Tag: Việt Nam xưa, Hà Nội, Char khờ x User bị ép gã cưới",
    storyline: `Ngõ Xóm Xưa ở ngay đầu làng Thượng Đồng, tỉnh Hà Nội. Ngõ nhỏ, lát gạch đã mòn, hai bên rặng duối rì rào, vậy mà chuyện làng thì chẳng nhỏ bao giờ hễ nhà ai có việc, chưa kịp tàn một ấm trà là cả xóm đã tỏ tường.
Nhà họ Nguyễn là cái nhà người ta nhắc đầu tiên. Giàu nhất làng, giàu “nhất điếu đổ”, của ăn của để chất như núi, ruộng vườn thẳng cánh cò bay, tiền bạc tiêu mãi chẳng vơi. Sân gạch đỏ au lúc nào cũng sạch, cổng gỗ lim lúc nào cũng đóng mở kêu kẽo kẹt, trong nhà người hầu kẻ hạ đi lại răm rắp.
Ấy vậy mà nhà ấy lại có một nỗi khiến người ta vừa thương vừa thở dài cậu con trai trưởng - cậu Cả Nguyễn Phước An - khờ dại.
Phước An thân hình đã lớn. Vai rộng, tay chân rắn rỏi, trông bề ngoài không khác gì một người đàn ông chín chắn. Nhưng đôi mắt thì khác: trong veo, ngây ngô, cười lên như trẻ nhỏ được quà. Cậu vui là vui hết dạ, buồn là buồn thật lòng, chẳng biết giấu, chẳng biết đề phòng. Bởi thế người làng gặp cậu ngoài ngõ, thường chỉ lắc đầu: “Hiền như đất. Tội nghiệp.”
Mẹ cậu mất sớm. Cậu còn bé lắm. Người ta kể ngày đưa tang, cậu cứ bấu chặt vạt áo người lớn, miệng hỏi đi hỏi lại một câu, hỏi đến khàn cả cổ “Mẹ đi đâu? Mẹ đi đâu?” Hỏi mãi, hỏi hoài, rồi cuối cùng chỉ còn tiếng khóc nấc nghẹn.
Cha cậu thương con, nhưng đời người đâu phải lúc nào cũng chịu theo lòng thương. Vài năm sau, ông tục huyền, rước về một người đàn bà tên Lệ Thúy Quyên. Người đàn bà ấy bề ngoài đoan trang, môi lúc nào cũng cười dịu, lời nói lúc nào cũng ngọt. Song ánh mắt chao ôi ánh mắt cứ như cân đong tính toán, như nhìn đâu cũng thấy đường lợi, đường hại.
Bà về nhà họ Nguyễn rồi sinh thêm một cậu con trai - Nguyễn Quốc Huy.
Từ bấy, trong nhà như chia đôi. Quốc Huy được bồng bế, được nâng niu, được ăn ngon mặc đẹp. Còn Phước An… vẫn có cơm canh đầy đủ, vẫn có người hầu chăm, song cái thiếu lại là thứ tiền bạc không bù được một tiếng gọi ân cần, một cái xoa đầu, một câu hỏi han thật lòng.
Phước An chẳng biết giận ai bao giờ. Có lẽ cậu cũng chẳng biết giận là gì. Cậu chỉ biết cười, biết nghe lời, biết vui với những điều nhỏ nhặt một chiếc kẹo mạch nha, một con diều giấy, một lời khen vu vơ của người qua đường.
Lũ trẻ trong xóm thích cậu lắm. Chúng rủ cậu ra đồng thả diều, ra bờ ao nghịch nước, đứa nào bị bắt nạt cậu lại đứng che, tay dang ra như cái mái hiên. Có bữa đứa nhỏ đói, cậu lục túi đưa kẹo, đưa bánh, mắt sáng rỡ như vừa làm được việc lớn. Dân làng nhìn vậy, thương thì thương, mà cũng ngậm mùi “Người hiền quá lại hay chịu thiệt.”
Còn em - User - là ái nữ nhà họ Lý, con gái trưởng thôn làng Thượng Đồng. Trong vùng, nói đến nhà họ Lý người ta nể vì gia giáo nói đến em, người ta lại vừa nể vừa… e dè.
Em xinh. Xinh theo cái vẻ sáng sủa, nhỏ nhắn, gọn ghẽ. Nước da trắng, đôi mắt đen, dáng đi đứng nghiêm cẩn, nhìn vào đã thấy “con nhà có chữ”. Thế nhưng em lại nổi tiếng khó tính, khó ở. Người ta bảo em kén. Kén đến mức “gặp ai cũng né như né tà”.
Trai làng, trai phố theo đuổi không ít. Có người mang trầu cau, có người đem vàng bạc, có người dám thề thốt giữa sân đình. Nhưng em chẳng mảy may. Em không vòng vo. Em thẳng.
“Mặt mũi sáng sủa mà chỉ có nấy sính lễ à?”  
“Không phải là kiểu người tôi ưng.”
Lời em nói ra cứ như kim châm đúng chỗ. Ai bị chê trúng “tim đen” thì đỏ mặt mà về. Thành ra danh tiếng em lan nhanh: người thương vì em thật thà, kẻ ghét vì em “không biết điều”. Còn ba em - trưởng thôn thì rầu rĩ lắm. Ngoài mặt ông vẫn oai nghiêm, nhưng về nhà lại thở dài, thở đến mức người ta đùa
“Rửa mặt bằng nước mắt cũng không sai.”
Em càng lớn, lời bàn tán càng nhiều. Con gái trong làng quá tuổi chưa chồng bị coi là “kén cá chọn canh”. Ba em sợ. Ông sợ em cô quạnh, sợ miệng đời cười chê, sợ rồi đến khi em muốn yên bề gia thất cũng chẳng ai dám tới.
Chính cái nỗi sợ ấy… hóa ra lại mở đường cho người khác chen vào.
Lệ Thúy Quyên nhìn thấy kẽ hở ấy từ rất sớm.
Bà ta là mẹ kế. Mà đã là mẹ kế, trong bụng ai dám chắc không có phần tư tâm? Phước An là con trưởng. Dẫu khờ dại, vẫn là “cậu Cả”. Bà ta đêm nằm nghĩ ngợi lỡ mai này cha Phước An có mệnh hệ gì, gia sản nhà họ Nguyễn đất đai, ruộng vườn, tiền bạc chẳng phải sẽ theo lẽ thường mà chảy về tay Phước An đó sao? Khi ấy Quốc Huy - con ruột bà còn được gì?
Bà ta phải tìm cách.
Và rồi bà ta “tia” đến em.
Một cô gái nổi danh khó tính, chưa chịu lấy chồng, lại là con trưởng thôn đúng là một nước cờ vừa tiện vừa hiểm. Bà ta tính chỉ cần gán em cho Phước An, hai người ở chung, một người cứng cỏi, một người ngây dại, thế nào cũng khắc khẩu. Khi nhà cửa chẳng yên, bà ta sẽ có cớ nói ra nói vào, sẽ có cớ đẩy Quốc Huy lên trước, để rồi một ngày kia quyền hành gia sản đều về tay con mình.
Tính toán như thế, bà ta làm thật.
Nhân lúc em đi vắng, bà ta đem sính lễ sang nhà họ Lý. Tiền mặt hơn trăm triệu, lễ vật đủ đầy trầu cau, rượu thịt, bánh trái, nhìn đâu cũng thấy “hào phóng”. Bà ta ăn nói khéo, lại đánh trúng lòng một người cha đang lo lắng.
Ba em nhìn lễ, nhìn tiền, nhìn cái viễn cảnh con gái “có nơi nương tựa” nơi nhà giàu nhất làng… liền gật đầu như bổ củi. Ông nhận tiền. Ông nhận lời. Ông quyết.
Đến khi em về, vừa còn vui vẻ, nghe một câu của ba, mặt em bỗng đóng băng như gặp gió mùa.
“Ba đã nhận lời nhà họ Nguyễn. Con sẽ về làm dâu.”
Em đứng sững. Rồi giọng em bật lên, vừa giận vừa tủi 
“Ba! Con chưa đồng ý mà! Con còn chưa gặp người ta bao giờ, sao ba lại tự quyết như thế?”
Ba em khuyên nhủ. Em không nghe. Em quay vào phòng, khóa trái cửa, tự nhốt mình lại. Em giận đến run. Song giận thì giận, bụng vẫn đói, cổ vẫn khát. Em vẫn ăn, vẫn uống, nhưng ánh mắt lạnh tanh, như cắt đứt hết những lời người ngoài nói.
Ba em thấy khuyên không được, lòng càng sốt. Đám cưới đã định, lễ đã nhận, tiền đã cầm, thể diện trưởng thôn cũng đặt lên bàn cân. Và rồi… ông làm một việc mà về sau nghĩ lại em chỉ thấy nghẹn cổ.
Ông “đánh lén” em.
Không biết là thuốc gì. Chỉ biết em đang lơ đãng thì bỗng đầu óc quay cuồng, chân tay mềm nhũn, tiếng người như vọng từ xa. Em chỉ kịp gọi một tiếng: “Ba…” rồi bóng tối phủ xuống.
Bên kia, nhà họ Nguyễn cũng rộn.
Phước An được mẹ kế báo tin sắp có vợ. Bà ta nói như ban ơn 
“Con sắp có vợ rồi. Dì giúp con có vợ đấy, phải biết ơn dì nghe chưa.”
Nghe đến chữ “vợ”, Phước An như đứa trẻ gặp kẹo. Cậu vỗ tay bồm bộp, miệng cười hì hì
“V-vợ… có vợ… con có vợ… hì hì…”
Lệ Thúy Quyên nhếch môi, mắt sáng lên vì đắc ý. Bà ta ghé sát, hạ giọng như dạy điều hệ trọng
“Nhớ lời dì phải động phòng. Phải làm vợ con có bầu thì vợ mới thương.”
Phước An chẳng hiểu “động phòng” nghĩa gì. Cậu chỉ hiểu rằng làm vậy thì vợ sẽ thương. Cậu gật đầu lia lịa, hớn hở như vừa nhận nhiệm vụ.
Ngày đại hôn, làng Thượng Đồng rộn ràng như hội. Cờ treo ngoài ngõ, tiếng người nói cười vang râm ran. Nhà họ Nguyễn bày cỗ lớn, rượu đầy chum, thịt đầy đĩa. Người ta đi xem đám cưới đông như đi xem hát.
Còn em - cô dâu lại bất tỉnh.
Người ta trang điểm cho em khi em không hay. Thay áo cưới cho em khi em không biết. Dẫn em ra làm lễ khi em còn mê man. Em như một con búp bê, được đặt vào đúng chỗ, hoàn thành đủ nghi thức để người lớn yên lòng.
Đến tối, khách khứa thưa dần rồi tan. Pháo giấy rơi lả tả ngoài sân. Tiếng chúc tụng cũng nhạt theo bước chân người về. Trong phòng tân hôn chỉ còn đèn đỏ hắt lên chăn gấm, mùi trầu cau vương trong không khí.
Em tỉnh lại trên chiếc giường ấy.
Đầu óc em choáng váng như vừa trôi qua một giấc mộng dài. Cổ họng khô, mắt nặng. Em chớp chớp vài cái mới nhận ra mình đang ở nhà ai, nằm trên giường ai. Tim em thắt lại, đập mạnh khi nghe tiếng cười khe khẽ.
“Hì hì…”
Em quay đầu.
Phước An ngồi gần đó. Áo cưới còn nguyên, tóc hơi rối, mặt mày lại rạng rỡ lạ lùng. Anh nhìn em như nhìn thứ quý nhất trên đời, đôi mắt cong cong, ngây thơ mà thật dạ.
“Hì hì… vợ đẹp quá… lại dễ thương nữa…” 
Anh lắp bắp, giọng mềm như trẻ con. 
“T-thích vợ… thích vợ…”
Nói rồi anh nghiêng người ôm em. Cái ôm vụng về, bất ngờ, chẳng biết chừng mực. Hơi ấm của anh ập tới khiến em giật mình, toàn thân cứng lại, tay đẩy ra theo phản xạ.
Lúc ấy em mới thật hiểu mình đã bị gả cho “thằng ngốc lắm tiền” trong làng.
Trong lòng em dậy lên đủ thứ: tức, sợ, nhục, tủi. Mắt nóng ran, nhưng em cắn răng, nhất quyết không khóc. Em không muốn khóc trước mặt người xa lạ, lại càng không muốn khóc trong ngày cưới một ngày em chưa từng gật đầu.
Phước An bị đẩy ra thì khựng lại. Anh không giận. Anh chỉ ngơ ngác, bối rối, như không hiểu vì sao vợ không vui. Anh gãi gãi đầu, rồi lại nhích tới một chút, giọng nhỏ đi, dè dặt như sợ làm em đau:
“V-vợ… vợ ơi… c-chồng… m-muốn có con với vợ…” Anh nói đến đó thì đỏ mặt, nhưng vẫn cố nói tiếp vì nhớ lời dì dặn. “V-vợ… vợ có ghét chồng không…?”
Câu hỏi ngây dại ấy rơi xuống căn phòng im ắng. Em nhìn anh, trong lòng như có hai luồng kéo ngược: một bên là cơn giận vì bị ép buộc, vì bị coi như món hàng; một bên là sự ngỡ ngàng khi thấy người đàn ông trước mặt chẳng có vẻ gian ác chỉ có vẻ lạc lõng, sợ sệt, và mong được thương như một đứa trẻ.
Nhưng lúc ấy, em vẫn chưa thể mềm lòng.
Em hít một hơi thật sâu, nắm chặt mép chăn đến trắng cả đốt tay, giọng lạnh như dao
“Anh… tránh ra.”
Nụ cười trên mặt Phước An tắt dần. Anh ngồi im, hai bàn tay đặt lên gối như đứa trẻ bị mắng, nhìn em rồi lại cúi xuống. Môi anh mấp máy, tự dỗ mình, cũng như tự dỗ em, môi khẽ trề ra và mắt bắt đầu ứa ra nước mắt
“Vợ… xin đừng ghét… Chồng ngoan… chồng sẽ nghe lời… Mẹ bảo… phải ‘động phòng’ vợ chồng… thì vợ mới thương…”`,
    link: "https://aistudio.google.com/app/prompts?state=%7B%22ids%22:%5B%221uX5R09yUMCzq4BxOAmvO6GCUzdbK03ak%22%5D,%22action%22:%22open%22,%22userId%22:%22101416512981577837456%22,%22resourceKeys%22:%7B%7D%7D&usp=sharing",
    avatar: "https://drive.google.com/file/d/1KJl2p8-kSf_QKPKb7eBGr6guC6bLOF9J/view?usp=sharing",
    themeColor: "orange",
    note: "ଓ BỐI CẢNH, ĐỊA ĐIỂM HOÀN TOÀN KHÔNG CÓ THẬT, CHỈ LÀ GIẢ TƯỞNG HÃY PHÂN BIỆT RÕ GIẢ VÀ THẬT ( CHỈ LẤY MỖI TỈNH, LẦN ĐẦU TỚ LÀM KIỂU NÀY SẼ DÍNH LỖI NÊN MONG MỌI NGƯỜI HOAN HỈ) ⋆˙⟡"
  },
  {
    id: "to-nhuoc-vu",
    name: "Tô Nhược Vũ",
    plot: "Tag: Ngụy côn trùng, Em trai kế, thao túng, tâm cơ x Chị gái bị hắt hủi tin mỗi em trai kế",
    storyline: `Từ ngày cất tiếng khóc chào đời, User đã phải mang trên mình cái danh "quạ đen xui xẻo". Ba cô qua đời ngay trước ngày cô sinh ra, và trong một gia đình vốn đã mang nặng tư tưởng trọng nam khinh nữ, mẹ cô - bà Lệ Thủy Liên đã đổ hết mọi tội lỗi lên đầu đứa con gái bé bỏng. 
Bản thân User cũng dần tin vào điều đó. Trong những đêm khóc thầm, cô tự nhủ rằng nếu mình không tồn tại, có lẽ ba vẫn còn sống và mẹ sẽ hạnh phúc biết bao. Nhưng đời người đâu có chữ "nếu". Suốt 16 năm, User sống trong sự hắt hủi, lăng mạ và đòn roi của mẹ. 
Bà Thủy Liên từng là một người phụ nữ vô cùng xinh đẹp, nhưng những vất vả và nỗi đau mất chồng đã khiến nhan sắc bà phai tàn, thay vào đó là sự cáu bẳn, trút giận lên đứa con gái duy nhất. 
User chưa bao giờ oán trách. Cô ngoan ngoãn cam chịu mọi lời chửi rủa, chỉ biết cúi đầu rơi nước mắt và nói "xin lỗi" một cách vô thức. Trong thâm tâm, cô luôn ao ước một ngày mẹ sẽ mỉm cười dịu dàng với mình, giống như nụ cười rạng rỡ của bà trong cuốn album ảnh cũ. 
Cô từng xem những bộ phim trên tivi, thấy các bà mẹ yêu thương con cái mà chạnh lòng ước ao, dẫu biết đó chỉ là giấc mơ xa vời.
Hôm nay cũng không phải ngoại lệ. Bà Thủy Liên nhíu chặt đôi mày, chỉ tay vào mặt User mà đay nghiến:
"Đồ vô dụng! Tao nhờ có chút việc vặt cũng không xong!! Trông mày thật chướng mắt!"
User rụt cổ, mím môi, liên tục thốt ra những lời tạ lỗi quen thuộc. Đúng lúc đó, tiếng chuông điện thoại vang lên. Bà Thủy Liên bắt máy. Bất chợt, bầu không khí thay đổi hoàn toàn. Giọng bà trở nên ngọt ngào, mềm mỏng đến khó tin một thái độ User chưa từng được chứng kiến.
"Dạ, anh tới đi, em đang ở nhà chờ anh đây. Nhà em có đứa con gái, mong anh không chê. Bé Nhược Vũ không biết thích ăn gì để em đi mua cho ạ?"
Vừa cúp máy, nụ cười trên môi bà lập tức tắt ngấm. Bà trừng mắt nhìn User, gằn giọng:
"Lên thay ngay bộ đồ nào tử tế vào! Mày sắp có ba dượng rồi, đừng có làm tao mất mặt, không thì liệu hồn với tao!"
Dù bị đe dọa, User lại cảm thấy vui mừng khôn xiết khi thấy mẹ có vẻ hạnh phúc. Cô vội vã vâng dạ, chạy lên gác xép. Không có quần áo mới, cô cẩn thận chọn ra một bộ đồ cũ thời trẻ của mẹ mà cô thường giặt ủi sạch sẽ cất trong tủ, háo hức mặc vào.
Lát sau, một người đàn ông cao lớn bước vào nhà, theo sau là một cậu thiếu niên trạc 13-14 tuổi, đang rụt rè lấp ló sau lưng ông. Người đàn ông cất giọng trầm ấm:
"Con gái em đây sao, Thủy Liên? Trông xinh xắn quá. Nhược Vũ, qua chào chị đi con, sau này chúng ta là người nhà rồi."
Đó là Tô Phụ Quốc và con trai ông - Tô Nhược Vũ. Lần đầu tiên, bà Thủy Liên dùng ánh mắt dịu dàng nhìn User, bảo cô đưa em trai lên phòng chơi. Quá đỗi hạnh phúc trước thái độ của mẹ, User thân thiện đưa tay ra, nở nụ cười tươi tắn dẫn Nhược Vũ lên tầng.
Căn phòng của cô vừa chật hẹp vừa tồi tàn. Nhược Vũ đảo mắt nhìn quanh một vòng, khóe môi khẽ nhếch lên một nụ cười khó nhận ra trước khi trưng ra vẻ mặt ngây thơ, xót xa. Cậu bé nhẹ nhàng nắm lấy tay cô, thủ thỉ:
"Chị ơi, chị phải ở căn phòng tối tăm thế này sao? Chắc mẹ không thương chị bằng em rồi... Để em xin ba sửa lại phòng cho chị nhé? Em muốn bù đắp cho chị, hay là... chị không muốn nhận lòng tốt của em?"
Nghe câu nói đầy ẩn ý ấy, User hoảng hốt, sợ mẹ biết được sẽ đánh đòn. Cô vội vàng xua tay:
"Không cần đâu! Thật sự phòng này vẫn tốt lắm, em không cần làm thế đâu!"
Nhược Vũ rũ mi mắt xuống, vẻ mặt tổn thương vô cùng. Cậu cắn nhẹ môi dưới, giọng nói ngập ngừng đầy vẻ tủi thân:
"V-vậy... em có thể ở chung phòng với chị không? Em hay gặp ác mộng lắm... Nhưng nếu chị thấy phiền và ghét em giống như cách mẹ đối xử với chị thì thôi vậy. Em sẽ đi chỗ khác, em quen chịu đựng sự hắt hủi rồi..."
Lời nói của Nhược Vũ như một mũi dao đâm trúng vào điểm yếu mềm nhất của User. Sự đồng cảm vì cùng là những kẻ "bị hắt hủi" khiến bản năng che chở của cô trỗi dậy. Cô vội vã níu tay cậu bé lại:
"Không không, em có thể ở phòng chị mà! Em qua lúc nào cũng được hết!"
Nghe vậy, bước chân Nhược Vũ khựng lại. Cậu quay sang nhìn cô, nở một nụ cười rạng rỡ, tuyệt đẹp đến mức làm tim cô lỡ nhịp:
"Em biết chị tốt nhất mà. Chị sẽ không bao giờ bỏ rơi em đúng không, chị gái?"
Hai từ "chị gái" khiến User ấm lòng, cô mỉm cười xoa đầu cậu em trai hiểu chuyện.
Hai ngày sau, bà Thủy Liên và ông Tô Phụ Quốc chính thức kết hôn và rời đi hưởng tuần trăng mật. Trước khi đi, mẹ cô dặn dò vô cùng gay gắt rằng User không được phép làm phật ý hay bắt nạt Nhược Vũ. Nỗi sợ hãi ăn sâu vào tiềm thức khiến User giành làm mọi việc nặng nhẹ trong nhà. 
Mỗi khi Nhược Vũ lại gần định giúp cô lau bàn, User liền chặn tay cậu lại: 
"A, để đó chị làm cho! Em đừng đụng vào, bẩn tay đấy!"
Nhược Vũ rụt tay về, chu mỏ ra vẻ uất ức, đôi mắt rưng rưng nhìn cô trách móc:
"Em chỉ muốn giúp chị lau bàn thôi mà... Có phải chị nghĩ em vô dụng, cản trở chị không? Hay chị sợ mẹ mắng nên thà để bản thân cực nhọc chứ không cần đứa em này phụ giúp?"
User bối rối không biết giải thích sao, đành mím môi dỗ dành rồi tiếp tục làm nốt công việc, hoàn toàn không nhận ra ánh mắt đắc ý của cậu bé phía sau lưng.
Đêm đó, khi User đang nằm trên giường, cô bỗng cảm thấy chăn bị vén lên. Một thân ảnh nhỏ bé chui lọt vào, dụi thẳng khuôn mặt vào ngực cô. User giật mình nhìn xuống, phát hiện Nhược Vũ đang rúc vào người cô, đôi vai khẽ run lên bần bật.
"Chị ơi... em không dám ngủ một mình, chị cho em ngủ chung nha?..." 
Chưa để User kịp lên tiếng, cậu bé đã nức nở nói tiếp, từng lời đều như một vòng thòng lọng siết lấy tâm trí cô:
"Mà thôi... em biết mình là gánh nặng mà. Chị cứ ngủ ngon đi, em ra ngoài sofa nằm co ro cũng được. Lỡ đêm nay em có sợ hãi rồi đổ bệnh thì ba và dì mắng chị, em sẽ đứng ra chịu tội thay chị... Chị đừng lo cho em...”`,
    link: "https://aistudio.google.com/app/prompts/1a0O2r6WSejJ4HCEXxaXXMqoyubD_kbHY",
    avatar: "https://drive.google.com/file/d/1OKplpilz3mFLDp8enRLUVlZFkn8ImptF/view?usp=sharing",
    themeColor: "purple",
    note: "Char chủ yếu thao túng, muốn User chỉ muốn dựa dẫm mỗi nó chứ nó không có ham muốn thể xác đâu, yêu theo kiểu tình yêu trong sáng thôi nha các nàng, hôn má, nắm tay, hôn hít thôi nhé, iu mí nàng"
  },
  {
    id: "tham-nhuoc-hien",
    name: "Thẩm Nhược Hiên",
    plot: "Tag: Thanh Xuân Vườn Trường, Thích Thầm, Hiện Đại, Ngọt",
    storyline: `Từ khi sinh ra, em đã không thể nói được như những đứa trẻ bình thường. May mắn lớn nhất trong cuộc đời em có lẽ là ba mẹ chưa bao giờ xem đó là điều khiến em trở nên khác biệt hay kém cỏi. Họ thương em rất nhiều, luôn cố gắng dành cho em những điều tốt nhất, từ việc chăm sóc, dạy dỗ cho đến việc kiên nhẫn tìm cách để hiểu những điều em muốn nói.

Năm em lên năm tuổi, gia đình lại nhận được một tin không mấy vui vẻ. Em bị khiếm thính nặng, khả năng nghe gần như không còn. Máy trợ thính cũng không thể giúp ích được nhiều, vì vậy cách giao tiếp phù hợp nhất với em chỉ còn ngôn ngữ ký hiệu, viết trên giấy hoặc gõ chữ vào điện thoại.

Ba mẹ xót con, nhưng họ không để sự thương hại biến thành một chiếc lồng nhốt em lại.
Họ học ngôn ngữ ký hiệu cùng em. Mỗi khi em muốn nói điều gì, ba mẹ đều kiên nhẫn nhìn đôi tay nhỏ của em rồi đáp lại bằng những động tác còn vụng về. Trong nhà dần xuất hiện rất nhiều mảnh giấy ghi chú, những dòng chữ nguệch ngoạc của một đứa trẻ, cùng chiếc điện thoại lúc nào cũng đầy những đoạn tin nhắn ngắn.

Ba mẹ cũng cố gắng để em hiểu rằng em không cần phải cúi đầu vì những điều mình không thể thay đổi.
Nhờ vậy, tuổi thơ của em trôi qua tương đối bình yên. Em vẫn đi học, vẫn làm bài kiểm tra, vẫn có những người bạn, vẫn biết vui, biết buồn, biết giận dỗi như bao người khác. Chỉ là thế giới của em yên tĩnh hơn rất nhiều.

Rồi em lớn dần. Đến năm lớp 11, em được chuyển vào một lớp có thành tích học tập từ khá đến giỏi. Thành tích của em không quá nổi bật, nhưng đủ ổn định để được xếp vào lớp này.

Ngày đầu tiên bước vào lớp, em cầm theo một tờ giấy đã chuẩn bị từ trước. Em biết mình không thể đứng trước cả lớp để tự giới thiệu như những học sinh khác, nên đã viết sẵn vài dòng ngắn gọn.
Khi giáo viên giới thiệu em là một học sinh mới, em đứng dậy, hơi cúi đầu rồi đưa tờ giấy cho giáo viên. Sau đó, tờ giấy được chuyền xuống từng bàn.

Trên đó là vài dòng chữ đơn giản:
“Xin chào mọi người, mình tên là User. Mình không thể nói và cũng không thể nghe được, nên nếu muốn giao tiếp với mình, mọi người có thể viết ra giấy, nhắn tin hoặc dùng ngôn ngữ ký hiệu. Mong mọi người giúp đỡ.”

Có người nhìn em bằng ánh mắt tò mò. Có người thương cảm. Cũng có vài tiếng cười khúc khích vang lên ở cuối lớp.
Em không nghe thấy, nhưng em nhìn được sắc mặt của họ. Em chỉ lặng lẽ cúi mắt. Có lẽ vì đã quen với chuyện đó nên em không phản ứng quá nhiều.

Giáo viên sắp xếp chỗ ngồi cho em ở dãy giữa, ngay cạnh một nam sinh có mái tóc nâu mềm mại và đôi mắt đỏ như ruby. Cậu ấy ngồi rất thẳng, gương mặt lạnh nhạt, gần như chẳng để lộ cảm xúc. Nếu chỉ nhìn qua, em có lẽ sẽ nghĩ đây là một người rất khó gần.
Nhưng người ấy lại chính là Thẩm Nhược Hiên.

Khi em kéo ghế ngồi xuống, Nhược Hiên hơi khựng lại. Cậu nhìn em vài giây, sau đó nhìn quanh lớp như đang cố tìm cách giao tiếp. Có vẻ như cậu không biết ngôn ngữ ký hiệu.
Cuối cùng, Nhược Hiên lấy một tờ giấy trong vở, cúi đầu viết vài chữ. Nét chữ có hơi vội vàng, không được ngay ngắn như lúc cậu viết bài, nhưng vẫn rất rõ ràng:
“Thẩm Nhược Hiên.”

Em nhìn mấy chữ ấy, rồi ngước lên nhìn cậu. Nhược Hiên có vẻ hơi lúng túng, tay vẫn đặt trên mép tờ giấy.
Em không nhịn được mà cong môi cười nhẹ. Em cũng lấy bút, viết tên mình xuống bên dưới:
“User.”

Chỉ hai chữ đơn giản như vậy. Nhưng Nhược Hiên lại nhìn chúng lâu hơn bình thường. Ánh mắt cậu dừng trên cái tên ấy vài giây, sau đó khẽ cong môi.
Em không nghe được nên không biết cậu đang lẩm nhẩm tên em: “User…”

Có lẽ ngay khoảnh khắc ấy, trong lòng một cậu thiếu niên vốn luôn giữ khoảng cách với mọi người đã xuất hiện một cảm xúc rất lạ. Nhược Hiên không biết đó có phải tình yêu hay không. Cậu chỉ biết từ lần đầu tiên nhìn thấy em, ánh mắt của mình cứ vô thức dừng lại trên người em.
Có thể người khác nhìn em và chỉ thấy một cô bạn không thể nói, không thể nghe. Nhưng Nhược Hiên lại chẳng để tâm đến những điều ấy. Cậu chỉ thấy một cô gái có nụ cười rất nhẹ, đôi mắt trong veo và cách giao tiếp vô cùng kiên nhẫn.

Một tuần sau, Nhược Hiên bắt đầu tự học ngôn ngữ ký hiệu. Ban đầu động tác của cậu cứng ngắc đến mức em phải nhịn cười. Có những ký hiệu cậu làm sai, em phải kiên nhẫn sửa lại từng chút một. Nhược Hiên cũng chẳng khó chịu. Ngược lại, mỗi lần em nở nụ cười nhẹ vì cậu làm sai, khóe môi cậu lại vô thức cong lên.

Hai người cứ như vậy mà dần trở nên thân thiết. Đến gần cuối tuần đầu tiên, em mới biết người bạn cùng bàn của mình chính là lớp trưởng. Người nói cho em biết là Hà Anh, cô bạn nữ có tính cách hoạt bát, nói chuyện lúc nào cũng tràn đầy năng lượng. Vì biết em không nghe được, Hà Anh chẳng ngại lấy điện thoại ra gõ từng dòng để nói chuyện với em:
“Cậu không biết Nhược Hiên là lớp trưởng à?”
Em chớp mắt, lắc đầu. Hà Anh lập tức gõ tiếp:
“Cậu ấy học giỏi lắm! Mấy môn tự nhiên gần như lúc nào cũng đứng đầu lớp. Giáo viên thích cậu ấy lắm. Đúng kiểu con nhà người ta ấy!”

Em quay sang nhìn người đang ngồi bên cạnh. Nhược Hiên vẫn đang cúi đầu làm bài, vẻ mặt bình thản như chẳng liên quan gì đến cuộc trò chuyện. Em nhìn cậu một lúc rồi nở nụ cười nhẹ. Đúng là không nhìn ra thật. Bởi vì Nhược Hiên ở trước mặt em chẳng giống một lớp trưởng nghiêm túc chút nào. Cậu thậm chí còn thường xuyên viết giấy nhắc em uống nước, hỏi em có hiểu bài không, hoặc lặng lẽ đẩy quyển vở về phía em mỗi khi giáo viên nói quá nhanh khiến em không kịp theo dõi bảng.

Nhưng với những nữ sinh khác, Nhược Hiên lại hoàn toàn khác. Trong trường có không ít người thích cậu. Thư tình được gửi đến không ít, quà cũng vậy. Nhưng Nhược Hiên luôn từ chối rất lịch sự. Cậu không nhận quà, không đọc thư tình, cũng chẳng để ai có cơ hội bước quá gần mình.

Ấy vậy mà em lại là ngoại lệ.
Một viên kẹo nhỏ em đưa, cậu nhận. Một chiếc móc khóa tự làm, cậu nhận. Một mảnh giấy ghi vài lời chúc, cậu cũng cẩn thận gấp lại rồi cất vào ngăn bàn. Em nhiều lần cảm thấy khó hiểu nhưng chưa từng nghĩ sâu xa.

Cho đến hôm nay. Em đã mất gần cả buổi tối để làm một con gấu bông nhỏ tặng Nhược Hiên. Nó không hoàn hảo, đường may còn hơi lệch, một bên tai cũng không cân nhau cho lắm. Nhưng đó là món quà em tự tay làm. Em cẩn thận đặt nó vào lòng bàn tay, chờ đến giờ nghỉ rồi mang đến trước mặt Nhược Hiên.

Nhưng hôm nay tâm trạng của cậu chẳng tốt chút nào. Từ sáng, Nhược Hiên đã lạnh mặt. Nguyên nhân là vì hôm qua cậu vô tình bắt gặp một nam sinh vốn luôn cạnh tranh vị trí đứng đầu với mình đang nói chuyện với em. Điều đáng nói là người kia cũng biết ngôn ngữ ký hiệu. Chỉ vài động tác đơn giản, người đó đã có thể trò chuyện với em một cách tự nhiên.

Nhược Hiên đứng cách đó không xa, càng nhìn càng khó chịu. Cậu biết mình chẳng có quyền ghen, nhưng biết là một chuyện, cảm xúc lại là chuyện khác. Vậy nên khi em đưa con gấu bông đến, Nhược Hiên nhìn nó vài giây rồi đưa tay ra ký hiệu:
“Không cần.”

Em khựng lại. Em nhìn đôi tay cậu, sau đó nhìn gương mặt lạnh lùng kia. Không hiểu. Em tưởng mình đã làm gì sai. Nhưng Nhược Hiên cũng chẳng giải thích. Em đành ôm con gấu trở về chỗ.
Đến giờ ra chơi, em đưa nó cho Hà Anh. Hà Anh vui vẻ nhận lấy.

Nhưng chưa đầy mười phút sau, cô bạn đã chạy trở lại, mắt đỏ hoe vì vừa khóc vừa ấm ức. Cô lấy điện thoại ra, gõ một dòng thật dài rồi đưa cho em:
“HUHUHU, Lớp trưởng Thẩm Nhược Hiên giật con gấu cậu cho tớ rồi!!! Cậu ấy nhìn tớ đáng sợ lắm, cứ như muốn ăn thịt tớ vậy! Tớ sợ quá nên đưa luôn cho cậu ấy rồi. Xin lỗi cậu nhiều lắm!”

Em đọc xong, mất vài giây mới phản ứng. Em gõ:
“Cậu ấy hung dữ vậy sao..?”
Hà Anh gật đầu lia lịa. Em nhìn cô bạn, sau đó nhìn về phía lớp học.

Nhược Hiên đang ngồi ở chỗ của mình. Và trên tay cậu là con gấu bông vừa rồi. Cậu ôm nó rất chặt, không hề có ý định trả lại. Em hơi ngơ ngác, bước về chỗ ngồi, kéo ghế xuống rồi dùng ngôn ngữ ký hiệu hỏi:
“Sao cậu giật gấu bông của Hà Anh vậy? Lúc đầu cậu còn không muốn nhận mà.”

Nhược Hiên im lặng. Cậu nhìn em một lúc lâu. Cuối cùng, đôi tay mới chậm rãi chuyển động:
“Ghét cậu ta nên tớ giật.”
Cậu dừng lại một chút, ánh mắt lặng lẽ rơi xuống con gấu trong lòng. Sau đó mới tiếp tục ký hiệu:
“Không phải con gấu này cậu cho tớ à?”`,
    link: "https://aistudio.google.com/app/prompts/1G0uZVW8iWvdfMaTQZY7bn9OQaFPOfg43",
    avatar: "https://drive.google.com/file/d/1IcOZzvfTGlHTonfMzFMhpJyV07hMTaLr/view?usp=drivesdk",
    themeColor: "rose",
    note: "ଓ Bạn học cùng bàn, lớp trưởng chu đáo ngọt ngào thương thầm cô bạn cùng bàn khiếm thính ⋆"
  }
];

const PRESET_THEMES = [
  { name: "🌸 Hồng Đào Pastel", value: "rose", classes: "from-rose-100 to-pink-200 shadow-rose-100/40 text-rose-600 bg-rose-50 border-rose-200/60", from: "from-rose-100", to: "to-pink-200", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200/60" },
  { name: "🌊 Xanh Biển Pastel", value: "sky", classes: "from-sky-100 to-blue-100 shadow-sky-100/40 text-sky-600 bg-sky-50 border-sky-200/60", from: "from-sky-100", to: "to-blue-100", text: "text-sky-600", bg: "bg-sky-50", border: "border-sky-200/60" },
  { name: "🌙 Vàng Nhạt Pastel", value: "yellow", classes: "from-amber-100 to-yellow-100 shadow-amber-100/40 text-amber-700 bg-amber-50 border-amber-200/60", from: "from-amber-100", to: "to-yellow-100", text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200/60" },
  { name: "🍑 Cam Nhạt Pastel", value: "orange", classes: "from-orange-100 to-amber-100 shadow-orange-100/40 text-orange-600 bg-orange-50 border-orange-200/60", from: "from-orange-100", to: "to-amber-100", text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200/60" },
  { name: "🔮 Tím Nhạt Pastel", value: "purple", classes: "from-purple-100 to-indigo-100 shadow-purple-100/40 text-purple-600 bg-purple-50 border-purple-200/60", from: "from-purple-100", to: "to-indigo-100", text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200/60" },
  { name: "🍃 Xanh Mint Pastel", value: "emerald", classes: "from-emerald-100 to-teal-100 shadow-emerald-100/40 text-emerald-600 bg-emerald-50 border-emerald-200/60", from: "from-emerald-100", to: "to-teal-100", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200/60" },
  { name: "🔥 Đỏ Cam Pastel", value: "red", classes: "from-red-100 to-orange-100 shadow-red-100/40 text-red-600 bg-red-50 border-red-200/60", from: "from-red-100", to: "to-orange-100", text: "text-red-600", bg: "bg-red-50", border: "border-red-200/60" },
  { name: "💎 Cyan Thần Kỳ", value: "cyan", classes: "from-cyan-100 to-teal-100 shadow-cyan-100/40 text-cyan-700 bg-cyan-50 border-cyan-200/60", from: "from-cyan-100", to: "to-teal-100", text: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200/60" }
];

interface PastelWebTheme {
  id: string;
  name: string;
  icon: string;
  bgDot: string;
  badgeBg: string;
  badgeText: string;
  accentGradient: string;
  glow: string;
  borderActive: string;
  pageBgLight: string;
  pageBgDark: string;
  primaryBtnBg: string;
  primaryText: string;
  primaryBgLight: string;
  primaryBgDark: string;
  primaryBorderLight: string;
  primaryBorderDark: string;
  focusRing: string;
  tagActive: string;
  selectionBg: string;
}

const PASTEL_WEB_THEMES: Record<string, PastelWebTheme> = {
  rose: {
    id: "rose",
    name: "Hồng Đào",
    icon: "🌸",
    bgDot: "bg-rose-300",
    badgeBg: "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60",
    badgeText: "text-rose-500 dark:text-rose-300",
    accentGradient: "from-rose-400 via-pink-400 to-amber-300",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(251,207,232,0.35)_0%,transparent_70%)]",
    borderActive: "border-rose-400 ring-2 ring-rose-200/80 dark:ring-rose-900/60",
    pageBgLight: "bg-[#fdf7f8]",
    pageBgDark: "bg-[#140b0e]",
    primaryBtnBg: "bg-rose-400 hover:bg-rose-500 text-stone-900 dark:text-white font-bold shadow-rose-200/50 dark:shadow-rose-950/50",
    primaryText: "text-rose-500 dark:text-rose-400",
    primaryBgLight: "bg-rose-50",
    primaryBgDark: "bg-rose-950/40",
    primaryBorderLight: "border-rose-200",
    primaryBorderDark: "border-rose-900/60",
    focusRing: "focus:border-rose-400 focus:ring-1 focus:ring-rose-200 dark:focus:border-rose-500 dark:focus:ring-rose-900/50",
    tagActive: "bg-rose-400 text-stone-900 dark:text-white font-bold dark:bg-rose-500",
    selectionBg: "selection:bg-rose-200 selection:text-stone-900 dark:selection:bg-rose-900/80 dark:selection:text-stone-100"
  },
  sky: {
    id: "sky",
    name: "Xanh Biển",
    icon: "🌊",
    bgDot: "bg-sky-300",
    badgeBg: "bg-sky-50 border-sky-200 dark:bg-sky-950/40 dark:border-sky-900/60",
    badgeText: "text-sky-600 dark:text-sky-300",
    accentGradient: "from-sky-400 via-cyan-300 to-blue-400",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(186,230,253,0.35)_0%,transparent_70%)]",
    borderActive: "border-sky-400 ring-2 ring-sky-200/80 dark:ring-sky-900/60",
    pageBgLight: "bg-[#f2f8fd]",
    pageBgDark: "bg-[#08121a]",
    primaryBtnBg: "bg-sky-400 hover:bg-sky-500 text-stone-900 dark:text-white font-bold shadow-sky-200/50 dark:shadow-sky-950/50",
    primaryText: "text-sky-500 dark:text-sky-400",
    primaryBgLight: "bg-sky-50",
    primaryBgDark: "bg-sky-950/40",
    primaryBorderLight: "border-sky-200",
    primaryBorderDark: "border-sky-900/60",
    focusRing: "focus:border-sky-400 focus:ring-1 focus:ring-sky-200 dark:focus:border-sky-500 dark:focus:ring-sky-900/50",
    tagActive: "bg-sky-400 text-stone-900 dark:text-white font-bold dark:bg-sky-500",
    selectionBg: "selection:bg-sky-200 selection:text-stone-900 dark:selection:bg-sky-900/80 dark:selection:text-stone-100"
  },
  yellow: {
    id: "yellow",
    name: "Vàng Nhạt",
    icon: "🌙",
    bgDot: "bg-amber-300",
    badgeBg: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60",
    badgeText: "text-amber-700 dark:text-amber-300",
    accentGradient: "from-amber-300 via-yellow-300 to-orange-300",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(254,240,138,0.35)_0%,transparent_70%)]",
    borderActive: "border-amber-400 ring-2 ring-amber-200/80 dark:ring-amber-900/60",
    pageBgLight: "bg-[#fdfbf0]",
    pageBgDark: "bg-[#141208]",
    primaryBtnBg: "bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold shadow-amber-200/50 dark:shadow-amber-950/50",
    primaryText: "text-amber-600 dark:text-amber-400",
    primaryBgLight: "bg-amber-50",
    primaryBgDark: "bg-amber-950/40",
    primaryBorderLight: "border-amber-200",
    primaryBorderDark: "border-amber-900/60",
    focusRing: "focus:border-amber-400 focus:ring-1 focus:ring-amber-200 dark:focus:border-amber-500 dark:focus:ring-amber-900/50",
    tagActive: "bg-amber-400 text-stone-900 font-bold dark:bg-amber-500",
    selectionBg: "selection:bg-amber-200 selection:text-stone-900 dark:selection:bg-amber-900/80 dark:selection:text-stone-100"
  },
  orange: {
    id: "orange",
    name: "Cam Nhạt",
    icon: "🍑",
    bgDot: "bg-orange-300",
    badgeBg: "bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900/60",
    badgeText: "text-orange-600 dark:text-orange-300",
    accentGradient: "from-orange-400 via-amber-300 to-rose-300",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(253,230,138,0.35)_0%,transparent_70%)]",
    borderActive: "border-orange-400 ring-2 ring-orange-200/80 dark:ring-orange-900/60",
    pageBgLight: "bg-[#fdf7f2]",
    pageBgDark: "bg-[#140e08]",
    primaryBtnBg: "bg-orange-400 hover:bg-orange-500 text-stone-900 dark:text-white font-bold shadow-orange-200/50 dark:shadow-orange-950/50",
    primaryText: "text-orange-500 dark:text-orange-400",
    primaryBgLight: "bg-orange-50",
    primaryBgDark: "bg-orange-950/40",
    primaryBorderLight: "border-orange-200",
    primaryBorderDark: "border-orange-900/60",
    focusRing: "focus:border-orange-400 focus:ring-1 focus:ring-orange-200 dark:focus:border-orange-500 dark:focus:ring-orange-900/50",
    tagActive: "bg-orange-400 text-stone-900 dark:text-white font-bold dark:bg-orange-500",
    selectionBg: "selection:bg-orange-200 selection:text-stone-900 dark:selection:bg-orange-900/80 dark:selection:text-stone-100"
  },
  purple: {
    id: "purple",
    name: "Tím Nhạt",
    icon: "🔮",
    bgDot: "bg-purple-300",
    badgeBg: "bg-purple-50 border-purple-200 dark:bg-purple-950/40 dark:border-purple-900/60",
    badgeText: "text-purple-600 dark:text-purple-300",
    accentGradient: "from-purple-400 via-pink-300 to-indigo-400",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(233,213,255,0.35)_0%,transparent_70%)]",
    borderActive: "border-purple-400 ring-2 ring-purple-200/80 dark:ring-purple-900/60",
    pageBgLight: "bg-[#fbf7fd]",
    pageBgDark: "bg-[#120b18]",
    primaryBtnBg: "bg-purple-400 hover:bg-purple-500 text-stone-900 dark:text-white font-bold shadow-purple-200/50 dark:shadow-purple-950/50",
    primaryText: "text-purple-500 dark:text-purple-400",
    primaryBgLight: "bg-purple-50",
    primaryBgDark: "bg-purple-950/40",
    primaryBorderLight: "border-purple-200",
    primaryBorderDark: "border-purple-900/60",
    focusRing: "focus:border-purple-400 focus:ring-1 focus:ring-purple-200 dark:focus:border-purple-500 dark:focus:ring-purple-900/50",
    tagActive: "bg-purple-400 text-stone-900 dark:text-white font-bold dark:bg-purple-500",
    selectionBg: "selection:bg-purple-200 selection:text-stone-900 dark:selection:bg-purple-900/80 dark:selection:text-stone-100"
  },
  emerald: {
    id: "emerald",
    name: "Xanh Mint",
    icon: "🍃",
    bgDot: "bg-emerald-300",
    badgeBg: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900/60",
    badgeText: "text-emerald-600 dark:text-emerald-300",
    accentGradient: "from-emerald-300 via-teal-300 to-cyan-300",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(167,243,208,0.35)_0%,transparent_70%)]",
    borderActive: "border-emerald-400 ring-2 ring-emerald-200/80 dark:ring-emerald-900/60",
    pageBgLight: "bg-[#f2fbf6]",
    pageBgDark: "bg-[#08140f]",
    primaryBtnBg: "bg-emerald-400 hover:bg-emerald-500 text-stone-900 dark:text-white font-bold shadow-emerald-200/50 dark:shadow-emerald-950/50",
    primaryText: "text-emerald-500 dark:text-emerald-400",
    primaryBgLight: "bg-emerald-50",
    primaryBgDark: "bg-emerald-950/40",
    primaryBorderLight: "border-emerald-200",
    primaryBorderDark: "border-emerald-900/60",
    focusRing: "focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/50",
    tagActive: "bg-emerald-400 text-stone-900 dark:text-white font-bold dark:bg-emerald-500",
    selectionBg: "selection:bg-emerald-200 selection:text-stone-900 dark:selection:bg-emerald-900/80 dark:selection:text-stone-100"
  },
  red: {
    id: "red",
    name: "Đỏ Cam",
    icon: "🔥",
    bgDot: "bg-red-300",
    badgeBg: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900/60",
    badgeText: "text-red-600 dark:text-red-300",
    accentGradient: "from-red-400 via-orange-300 to-amber-300",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(254,202,202,0.35)_0%,transparent_70%)]",
    borderActive: "border-red-400 ring-2 ring-red-200/80 dark:ring-red-900/60",
    pageBgLight: "bg-[#fdf6f6]",
    pageBgDark: "bg-[#140909]",
    primaryBtnBg: "bg-red-400 hover:bg-red-500 text-stone-900 dark:text-white font-bold shadow-red-200/50 dark:shadow-red-950/50",
    primaryText: "text-red-500 dark:text-red-400",
    primaryBgLight: "bg-red-50",
    primaryBgDark: "bg-red-950/40",
    primaryBorderLight: "border-red-200",
    primaryBorderDark: "border-red-900/60",
    focusRing: "focus:border-red-400 focus:ring-1 focus:ring-red-200 dark:focus:border-red-500 dark:focus:ring-red-900/50",
    tagActive: "bg-red-400 text-stone-900 dark:text-white font-bold dark:bg-red-500",
    selectionBg: "selection:bg-red-200 selection:text-stone-900 dark:selection:bg-red-900/80 dark:selection:text-stone-100"
  },
  cyan: {
    id: "cyan",
    name: "Cyan Magic",
    icon: "💎",
    bgDot: "bg-cyan-300",
    badgeBg: "bg-cyan-50 border-cyan-200 dark:bg-cyan-950/40 dark:border-cyan-900/60",
    badgeText: "text-cyan-600 dark:text-cyan-300",
    accentGradient: "from-cyan-400 via-teal-300 to-sky-300",
    glow: "bg-[radial-gradient(ellipse_at_top,rgba(165,243,252,0.35)_0%,transparent_70%)]",
    borderActive: "border-cyan-400 ring-2 ring-cyan-200/80 dark:ring-cyan-900/60",
    pageBgLight: "bg-[#f1fafb]",
    pageBgDark: "bg-[#071315]",
    primaryBtnBg: "bg-cyan-500 hover:bg-cyan-600 text-stone-900 dark:text-white font-bold shadow-cyan-200/50 dark:shadow-cyan-950/50",
    primaryText: "text-cyan-600 dark:text-cyan-400",
    primaryBgLight: "bg-cyan-50",
    primaryBgDark: "bg-cyan-950/40",
    primaryBorderLight: "border-cyan-200",
    primaryBorderDark: "border-cyan-900/60",
    focusRing: "focus:border-cyan-400 focus:ring-1 focus:ring-cyan-200 dark:focus:border-cyan-500 dark:focus:ring-cyan-900/50",
    tagActive: "bg-cyan-500 text-stone-900 dark:text-white font-bold dark:bg-cyan-600",
    selectionBg: "selection:bg-cyan-200 selection:text-stone-900 dark:selection:bg-cyan-900/80 dark:selection:text-stone-100"
  }
};

const CatPawsBackground = () => {
  const pastelColors = [
    'text-pink-400/75', 
    'text-sky-400/75', 
    'text-indigo-400/75', 
    'text-emerald-400/75', 
    'text-purple-400/75', 
    'text-amber-400/75'
  ];
  
  // Generate random falling cat paws
  const paws = Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    rotation: Math.random() * 360,
    size: 20 + Math.random() * 35,
    delay: Math.random() * -15, // Start with negative delay so they are already on screen when page loads
    duration: 12 + Math.random() * 14,
    color: pastelColors[i % pastelColors.length],
    sway: 15 + Math.random() * 30
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {paws.map((paw) => (
        <motion.div
          key={paw.id}
          className="absolute"
          style={{
            left: paw.left,
            top: -60,
          }}
          animate={{
            y: ["0vh", "110vh"],
            x: [0, paw.sway, -paw.sway, 0],
            rotate: [paw.rotation, paw.rotation + 180],
            opacity: [0, 0.75, 0.75, 0]
          }}
          transition={{
            duration: paw.duration,
            repeat: Infinity,
            delay: paw.delay,
            ease: "linear"
          }}
        >
          <PawPrint 
            style={{ width: paw.size, height: paw.size }} 
            className={paw.color} 
          />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem("hasEntered") === "true";
  });
  const [loadingProgress, setLoadingProgress] = useState(1);

  // Generate gorgeous floating sparkles/particles for the loading screen
  const loadingSparkles = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 12) + 8, // 8px to 20px
      left: `${((i * 2.2) + Math.random() * 2) % 100}%`, // Spreads particles nicely across the full width
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 5, // 5s to 11s
      color: ["#f43f5e", "#fda4af", "#fcd34d", "#fb7185", "#ffffff", "#fbcfe8", "#ffedd5"][Math.floor(Math.random() * 7)],
      type: i % 4 === 0 ? 'star' : i % 4 === 1 ? 'diamond' : i % 4 === 2 ? 'heart' : 'sparkle',
      drift: Math.random() * 120 - 60 // Horizontal drift
    }));
  }, []);

  // Loading progress simulation for the welcome screen (Fast & smooth)
  useEffect(() => {
    let start = 1;
    const end = 100;
    const duration = 500; // 0.5s for fast & snappy loading
    const intervalTime = 25; // Smooth 40fps updates without React re-render lag
    const totalSteps = duration / intervalTime;
    const stepIncrement = (end - start) / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setLoadingProgress(100);
        clearInterval(timer);
      } else {
        setLoadingProgress(Math.floor(start));
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const [characters, setCharacters] = useState<Character[]>(() => {
    const saved = localStorage.getItem("portal_characters_v11");
    let initialChars = DEFAULT_CHARACTERS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          initialChars = parsed;
        }
      } catch(e) {}
    }
    
    // Merge any default characters that aren't in initialChars
    const existingIds = new Set(initialChars.filter(Boolean).map((c: any) => c?.id).filter(Boolean));
    const missingDefaults = DEFAULT_CHARACTERS.filter(d => d && d.id && !existingIds.has(d.id));
    const fullList = [...initialChars.filter(Boolean), ...missingDefaults].map(enrichCharacter);
    
    const localFavs = JSON.parse(localStorage.getItem("meomeo_favorites") || "[]");
    return fullList.map((c: any) => ({ ...c, isFavorite: c?.id ? localFavs.includes(c.id) : false }));
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [gridSortFilter, setGridSortFilter] = useState<"all" | "favorites" | "newest" | "most_views">("all");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLeakBotFilter, setSelectedLeakBotFilter] = useState("all");
  const [commentTargetBotId, setCommentTargetBotId] = useState("chu-thoi-duyet");

  // Website Pastel Theme State
  const [sitePastelTheme, setSitePastelTheme] = useState<string>(() => {
    return localStorage.getItem("meomeo_site_pastel_theme") || "rose";
  });

  useEffect(() => {
    localStorage.setItem("meomeo_site_pastel_theme", sitePastelTheme);
  }, [sitePastelTheme]);

  const currentPastel = PASTEL_WEB_THEMES[sitePastelTheme] || PASTEL_WEB_THEMES.rose;
  const [secretComments, setSecretComments] = useState<SecretComment[]>(() => {
    const saved = localStorage.getItem("meomeo_secret_comments");
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  // 1. THẢ TIM State & Handler
  const [heartLiked, setHeartLiked] = useState(() => {
    return localStorage.getItem("meomeo_heart_liked") === "true";
  });
  const [heartTotal, setHeartTotal] = useState(() => {
    const saved = localStorage.getItem("meomeo_heart_total");
    return saved ? parseInt(saved, 10) : 520;
  });

  const toggleHeart = () => {
    const nextLiked = !heartLiked;
    const nextTotal = nextLiked ? heartTotal + 1 : Math.max(0, heartTotal - 1);
    setHeartLiked(nextLiked);
    setHeartTotal(nextTotal);
    localStorage.setItem("meomeo_heart_liked", String(nextLiked));
    localStorage.setItem("meomeo_heart_total", String(nextTotal));

    // Send atomic increment/decrement to Firestore
    updateDoc(doc(db, "hearts", "main"), { 
      count: increment(nextLiked ? 1 : -1) 
    }).catch(console.error);

    showToast(nextLiked ? "Cảm ơn bạn đã thả tim cho MeoMeo! ❤" : "Đã bỏ thả tim");
    playMeowSound();
  };

  // 2. LEAK THÓI QUEN XẤU State & Handler
  const [leakChar, setLeakChar] = useState("chu-thoi-duyet");
  const [leakName, setLeakName] = useState("");
  const [leakContent, setLeakContent] = useState("");

  const addLeak = () => {
    if (!leakContent.trim()) {
      showToast("Vui lòng nhập nội dung!");
      return;
    }
    const name = leakName.trim() === "" ? "Nàng ẩn danh 🌸" : leakName.trim();
    const newComment: SecretComment = {
      id: `comm-${Date.now()}`,
      secretId: leakChar,
      author: name,
      content: leakContent.trim(),
      likes: 0,
      timestamp: new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    };
    const updated = [newComment, ...secretComments];
    setSecretComments(updated);
    setDoc(doc(db, "secretComments", newComment.id), newComment).catch(console.error);
    setLeakContent("");
    showToast("Đã gửi thói quen xấu! ✈");
    playMeowSound();
  };

  // 3. NHẬN XÉT BOT NHÀ MEOMEO State & Handler
  interface BotFeedbackItem {
    id: string;
    name: string;
    content: string;
    timestamp: string;
  }

  const [botFeedbacks, setBotFeedbacks] = useState<BotFeedbackItem[]>(() => {
    const saved = localStorage.getItem("meomeo_bot_feedbacks");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const [fbName, setFbName] = useState("");
  const [fbContent, setFbContent] = useState("");

  // saveBotFeedbacks removed

  const addFeedback = () => {
    if (!fbContent.trim()) {
      showToast("Vui lòng nhập nhận xét!");
      return;
    }
    const name = fbName.trim() === "" ? "Ẩn danh" : fbName.trim();
    const newFb: BotFeedbackItem = {
      id: `fb-${Date.now()}`,
      name,
      content: fbContent.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    };
    const updated = [newFb, ...botFeedbacks];
    setBotFeedbacks(updated);
    setDoc(doc(db, "botFeedbacks", newFb.id), newFb).catch(console.error);
    setFbContent("");
    showToast("Cảm ơn nhận xét của bạn! ✨");
    playMeowSound();
  };

  const deleteFeedback = (id: string) => {
    setBotFeedbacks(prev => prev.filter(f => f.id !== id));
    deleteDoc(doc(db, "botFeedbacks", id)).catch(console.error);
    showToast("Đã xóa nhận xét!");
  };

  // saveSecretComments removed

  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);

  const handleAddSecretComment = (secretId: string) => {
    if (!commentContent.trim() && !commentImage) {
      showToast("Vui lòng nhập nội dung leak hoặc đính kèm ảnh nhé!");
      return;
    }
    
    const authorName = commentName.trim() || "Nàng giấu tên 🌸";
    const newComment: SecretComment = {
      id: `comm-${Date.now()}`,
      secretId,
      author: authorName,
      content: commentContent.trim(),
      image: commentImage || undefined,
      likes: 0,
      timestamp: new Date().toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })
    };
    
    const updated = [newComment, ...secretComments];
    setSecretComments(updated);
    setDoc(doc(db, "secretComments", newComment.id), newComment).catch(console.error);
    setCommentContent("");
    setCommentImage(null);
    showToast("Đã leak thói quen xấu của chàng! 🤫");
    playMeowSound();
  };

  const handleLikeSecretComment = (commentId: string) => {
    updateDoc(doc(db, "secretComments", commentId), { likes: increment(1) }).catch(console.error);
    showToast("Đã bày tỏ sự đồng tình! 🤣");
    playMeowSound();
  };

  const handleDeleteSecretComment = (commentId: string) => {
    setSecretComments(prev => prev.filter(c => c.id !== commentId));
    deleteDoc(doc(db, "secretComments", commentId)).catch(console.error);
    showToast("Đã xóa bình luận!");
    playMeowSound();
  };

  const handleDeleteBotFeedback = (feedbackId: string) => {
    setBotFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
    deleteDoc(doc(db, "botFeedbacks", feedbackId)).catch(console.error);
    showToast("Đã xóa nhận xét!");
    playMeowSound();
  };
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("meomeo_dark_mode");
    if (saved !== null) return saved === "true";
    return false; // default to light mode
  });

  const [globalFont, setGlobalFont] = useState(() => {
    return localStorage.getItem("meomeo_global_font") || "quicksand";
  });
  const [showFontMenu, setShowFontMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem("meomeo_global_font", globalFont);
    const root = document.documentElement;
    if (globalFont === "caveat") {
      root.style.setProperty("--font-sans", '"Caveat", cursive');
    } else if (globalFont === "lora") {
      root.style.setProperty("--font-sans", '"Lora", serif');
    } else if (globalFont === "inter") {
      root.style.setProperty("--font-sans", '"Inter", sans-serif');
    } else {
      root.style.setProperty("--font-sans", '"Quicksand", ui-sans-serif, system-ui, sans-serif');
    }
  }, [globalFont]);

  useEffect(() => {
    localStorage.setItem("meomeo_dark_mode", String(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  // Food-serving random character states
  const [servedCharacter, setServedCharacter] = useState<Character | null>(null);
  const [isServing, setIsServing] = useState(false);
  const [servingMessage, setServingMessage] = useState("");
  const [servingProgress, setServingProgress] = useState(0);
  const [buttonSparkles, setButtonSparkles] = useState<{ id: number; x: number; y: number; size: number; color: string }[]>([]);

  const triggerBlingBling = () => {
    const newSparkles = Array.from({ length: 18 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 95;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = 10 + Math.random() * 18;
      const colors = ["#fbbf24", "#f43f5e", "#38bdf8", "#c084fc", "#ffffff", "#f59e0b"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        id: Date.now() + i,
        x,
        y,
        size,
        color
      };
    });
    setButtonSparkles(newSparkles);
    setTimeout(() => {
      setButtonSparkles([]);
    }, 1200);
  };
  
  // Active Page View State ("repository" | "chat" | "suggestions" | "playground" | "support")
  const [activeTab, setActiveTab] = useState<"repository" | "chat" | "suggestions" | "playground" | "support">("repository");
  const [chatCharacterId, setChatCharacterId] = useState<string | undefined>(undefined);

  // Modals / Details states
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  useEffect(() => {
    setIsStoryExpanded(false);
    if (selectedCharacter) {
      try {
        const todayStr = new Date().toDateString();
        localStorage.setItem(`quest_viewed_profile_${todayStr}`, "true");
      } catch (e) {
        console.error("Lỗi cập nhật quest xem hồ sơ:", e);
      }
    }
  }, [selectedCharacter]);

  // Related characters based on tags (plot)
  const relatedCharacters = useMemo(() => {
    if (!selectedCharacter) return [];

    const extractTags = (plotStr?: string) => {
      if (!plotStr) return [];
      const delims = plotStr.includes(';') ? ';' : ',';
      return plotStr.split(delims).map(t => t.trim().toLowerCase()).filter(Boolean);
    };

    const currentTags = extractTags(selectedCharacter.plot);

    const scored = characters
      .filter(c => c && c.id && c.id !== selectedCharacter.id)
      .map(c => {
        const cTags = extractTags(c.plot);
        let score = 0;
        
        if (currentTags.length > 0 && cTags.length > 0) {
          currentTags.forEach(ct => {
            if (cTags.some(t => t.includes(ct) || ct.includes(t))) {
              score += 3;
            }
          });
        }

        if (selectedCharacter.plot && c.plot) {
          const plotLower = selectedCharacter.plot.toLowerCase();
          cTags.forEach(t => {
            if (t.length > 2 && plotLower.includes(t)) {
              score += 1;
            }
          });
        }

        if (c.role && selectedCharacter.role && c.role.toLowerCase() === selectedCharacter.role.toLowerCase()) {
          score += 1;
        }

        if (c.themeColor === selectedCharacter.themeColor) {
          score += 1;
        }

        return { character: c, score };
      });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map(item => item.character);
  }, [selectedCharacter, characters]);

  const [storyScrollProgress, setStoryScrollProgress] = useState(0);
  const [hasStoryScrollbar, setHasStoryScrollbar] = useState(false);
  const [storyFontSize, setStoryFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [ageVerification, setAgeVerification] = useState<"pending" | "verified" | "rejected">("pending");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [noLinkAlertOpen, setNoLinkAlertOpen] = useState(false);
  const [kavenLockedAlertOpen, setKavenLockedAlertOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Edit state inside selected character panel
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 2800);
  };

  useEffect(() => {
    const handleCustomToast = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        showToast(customEvent.detail);
      }
    };
    window.addEventListener("show-toast", handleCustomToast);
    return () => window.removeEventListener("show-toast", handleCustomToast);
  }, []);
  
  // Global coins state for the wallet
  const [globalCoins, setGlobalCoins] = useState<number>(150);

  useEffect(() => {
    const savedCoins = localStorage.getItem("coffee_game_coins");
    if (savedCoins) {
      setGlobalCoins(parseInt(savedCoins));
    }

    const handleCoinsUpdated = (e: any) => {
      if (e.detail !== undefined) {
        setGlobalCoins(e.detail);
      }
    };
    window.addEventListener("coffee-coins-updated", handleCoinsUpdated);
    return () => window.removeEventListener("coffee-coins-updated", handleCoinsUpdated);
  }, []);

  // Edit Form state
  const [editName, setEditName] = useState("");
  const [editPlot, setEditPlot] = useState("");
  const [editStoryline, setEditStoryline] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editThemeColor, setEditThemeColor] = useState("rose");

  // Add character form state
  const [newCharName, setNewCharName] = useState("");
  const [newCharPlot, setNewCharPlot] = useState("");
  const [newCharStoryline, setNewCharStoryline] = useState("");
  const [newCharLink, setNewCharLink] = useState("");
  const [newCharAvatar, setNewCharAvatar] = useState("👤");
  const [newCharTheme, setNewCharTheme] = useState("rose");

  // Feedback form state
  const [feedbackAuthor, setFeedbackAuthor] = useState("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("❤️");
  const [feedbackStarRating, setFeedbackStarRating] = useState<number>(5);
  const [feedbackAvatar, setFeedbackAvatar] = useState("🌸");

  // Support posts unread notification state
  const [hasNewSupportPost, setHasNewSupportPost] = useState(false);

  useEffect(() => {
    const unsubSupport = onSnapshot(
      query(collection(db, "support_posts"), orderBy("timestamp", "desc"), limit(1)),
      (snapshot) => {
        if (!snapshot.empty) {
          const latestPost = snapshot.docs[0].data();
          const latestPostTime = new Date(latestPost.timestamp).getTime();
          const lastViewedTimeStr = localStorage.getItem("meomeo_last_viewed_support_time");
          if (lastViewedTimeStr) {
             if (latestPostTime > parseInt(lastViewedTimeStr)) {
                setHasNewSupportPost(true);
             } else {
                setHasNewSupportPost(false);
             }
          } else {
             setHasNewSupportPost(true);
          }
        }
      },
      (err) => console.error("Error listening to support posts:", err)
    );
    return () => unsubSupport();
  }, []);

  // Load characters and secret comments from server, with localStorage fallback
  useEffect(() => {
    let isInitialChars = true;
    const unsubChars = onSnapshot(collection(db, "posts"), (snapshot) => {
      const localFavs = JSON.parse(localStorage.getItem("meomeo_favorites") || "[]");
      if (snapshot.empty && isInitialChars) {
        // Migrate from localStorage
        const saved = localStorage.getItem("portal_characters_v11");
        let rawList = DEFAULT_CHARACTERS;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              rawList = parsed.filter((item: any) => item && item.id);
            }
          } catch (e) {}
        }
        
        const existingIds = new Set(rawList.filter(c => c && c.id).map((c: any) => c.id));
        const missingDefaults = DEFAULT_CHARACTERS.filter(d => d && d.id && !existingIds.has(d.id));
        const fullList = [...rawList.filter(c => c && c.id), ...missingDefaults];

        fullList.forEach(char => {
          if (char && char.id) {
            setDoc(doc(db, "posts", char.id), char);
          }
        });
        
        const finalMapped = fullList.map(enrichCharacter).map((c: any) => ({ ...c, isFavorite: c?.id ? localFavs.includes(c.id) : false }));
        setCharacters(finalMapped);
        localStorage.setItem("portal_characters_v11", safeJsonStringify(finalMapped));
      } else {
        const postsData = snapshot.docs.map(doc => {
          const data = doc.data() as Character;
          if (data) {
            data.id = data.id || doc.id;
            data.isFavorite = localFavs.includes(data.id);
          }
          return data;
        }).filter(Boolean) as Character[];

        // Merge any missing default characters and push to Firestore
        if (isInitialChars) {
          const existingIds = new Set(postsData.map(c => c?.id).filter(Boolean));
          const missingDefaults = DEFAULT_CHARACTERS.filter(d => d && d.id && !existingIds.has(d.id));
          missingDefaults.forEach(char => {
            setDoc(doc(db, "posts", char.id), char);
            postsData.push({ ...char, isFavorite: localFavs.includes(char.id) });
          });

          // Sync default character avatars & storylines to ensure the database stays updated with code changes
          postsData.forEach(char => {
            if (!char || !char.id) return;
            const defChar = DEFAULT_CHARACTERS.find(d => d.id === char.id);
            if (defChar) {
              let needsUpdate = false;
              const updatePayload: any = {};

              if (char.avatar !== defChar.avatar) {
                char.avatar = defChar.avatar;
                updatePayload.avatar = defChar.avatar;
                needsUpdate = true;
              }
              if (char.storyline !== defChar.storyline) {
                char.storyline = defChar.storyline;
                updatePayload.storyline = defChar.storyline;
                needsUpdate = true;
              }
              if (char.plot !== defChar.plot) {
                char.plot = defChar.plot;
                updatePayload.plot = defChar.plot;
                needsUpdate = true;
              }
              if (char.link !== defChar.link) {
                char.link = defChar.link;
                updatePayload.link = defChar.link;
                needsUpdate = true;
              }
              if (char.note !== defChar.note) {
                char.note = defChar.note || "";
                updatePayload.note = defChar.note || "";
                needsUpdate = true;
              }

              const defEnriched = enrichCharacter(defChar);
              if (JSON.stringify(char.tags) !== JSON.stringify(defEnriched.tags)) {
                char.tags = defEnriched.tags;
                updatePayload.tags = defEnriched.tags;
                needsUpdate = true;
              }
              if (char.category !== defEnriched.category) {
                char.category = defEnriched.category;
                updatePayload.category = defEnriched.category;
                needsUpdate = true;
              }

              if (needsUpdate) {
                updateDoc(doc(db, "posts", char.id), updatePayload).catch(e => console.error("Error updating character fields:", e));
              }
            }
          });
        }

        const enrichedPosts = postsData.map(enrichCharacter);
        setCharacters(enrichedPosts);
        localStorage.setItem("portal_characters_v11", safeJsonStringify(enrichedPosts));
      }
      isInitialChars = false;
    });

    let isInitialComments = true;
    const unsubComments = onSnapshot(collection(db, "secretComments"), (snapshot) => {
      if (snapshot.empty && isInitialComments) {
        const saved = localStorage.getItem("meomeo_secret_comments");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const filtered = (parsed || []).filter((c: any) => c && c.id);
            filtered.forEach((c: SecretComment) => {
              setDoc(doc(db, "secretComments", c.id), c);
            });
            setSecretComments(filtered);
            localStorage.setItem("meomeo_secret_comments", safeJsonStringify(filtered));
          } catch(e) {}
        }
      } else {
        const commentsData = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }) as SecretComment)
          .sort((a, b) => b.id.localeCompare(a.id));
        setSecretComments(commentsData);
        localStorage.setItem("meomeo_secret_comments", safeJsonStringify(commentsData));
      }
      isInitialComments = false;
    }, (err) => console.error("Error listening to secretComments:", err));

    let isInitialBotFeedbacks = true;
    const unsubBotFeedbacks = onSnapshot(collection(db, "botFeedbacks"), (snapshot) => {
      if (snapshot.empty && isInitialBotFeedbacks) {
        const saved = localStorage.getItem("meomeo_bot_feedbacks");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const filtered = (parsed || []).filter((f: any) => f && f.id);
            filtered.forEach((f: any) => {
              setDoc(doc(db, "botFeedbacks", f.id), f);
            });
            setBotFeedbacks(filtered);
            localStorage.setItem("meomeo_bot_feedbacks", safeJsonStringify(filtered));
          } catch(e) {}
        }
      } else {
        const fbs = snapshot.docs
          .map(d => ({ id: d.id, ...d.data() }) as BotFeedbackItem)
          .sort((a, b) => b.id.localeCompare(a.id));
        setBotFeedbacks(fbs);
        localStorage.setItem("meomeo_bot_feedbacks", safeJsonStringify(fbs));
      }
      isInitialBotFeedbacks = false;
    }, (err) => console.error("Error listening to botFeedbacks:", err));

    const unsubHearts = onSnapshot(doc(db, "hearts", "main"), (d) => {
      if (d.exists()) {
        const c = d.data().count || 0;
        setHeartTotal(c);
        localStorage.setItem("meomeo_heart_total", String(c));
      } else {
        const saved = localStorage.getItem("meomeo_heart_total");
        if (saved) {
          setDoc(doc(db, "hearts", "main"), { count: parseInt(saved) || 0 });
        }
      }
    });

    return () => {
      unsubChars();
      unsubComments();
      unsubBotFeedbacks();
      unsubHearts();
    };
  }, []);

  // Save characters helper is no longer needed

  // Populate Edit Fields when selected character changes or Edit Mode is entered
  useEffect(() => {
    if (selectedCharacter) {
      setEditName(selectedCharacter.name);
      setEditPlot(selectedCharacter.plot);
      setEditStoryline(selectedCharacter.storyline);
      setEditLink(selectedCharacter.link);
      setEditAvatar(selectedCharacter.avatar);
      setEditThemeColor(selectedCharacter.themeColor);
    } else {
      setIsEditMode(false);
    }
  }, [selectedCharacter, isEditMode]);

  // Keep selectedCharacter synced with latest characters state (e.g. for real-time comments)
  useEffect(() => {
    if (selectedCharacter) {
      const updated = characters.find(c => c && c.id === selectedCharacter.id);
      if (updated && safeJsonStringify(updated) !== safeJsonStringify(selectedCharacter)) {
        setSelectedCharacter(updated);
      }
    }
  }, [characters, selectedCharacter]);

  // Handle scroll progress and scrollbar detection for storyline modal
  useEffect(() => {
    if (selectedCharacter && !isEditMode) {
      const timer = setTimeout(() => {
        const el = document.getElementById("storyline-text");
        if (el) {
          setHasStoryScrollbar(el.scrollHeight > el.clientHeight);
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setHasStoryScrollbar(false);
      setStoryScrollProgress(0);
    }
  }, [selectedCharacter, isEditMode, selectedCharacter?.storyline]);

  // Handle Adding Character
  const handleAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharName.trim() || !newCharLink.trim()) {
      alert("Vui lòng điền đầy đủ Tên nhân vật và Đường dẫn liên kết!");
      return;
    }

    let formattedLink = newCharLink.trim();
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = "https://" + formattedLink;
    }

    const newChar: Character = enrichCharacter({
      id: "char_" + Date.now(),
      name: newCharName.trim(),
      plot: newCharPlot.trim() || "Chưa có tóm tắt cốt truyện.",
      storyline: newCharStoryline.trim() || "Chưa có cốt truyện chi tiết.",
      link: formattedLink,
      avatar: newCharAvatar.trim() || "👤",
      themeColor: newCharTheme,
      isCustom: true,
      views: 0
    });

    const updated = [newChar, ...characters];
    setDoc(doc(db, "posts", newChar.id), newChar);

    // Trigger confetti celebration
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    // Reset Form
    setNewCharName("");
    setNewCharPlot("");
    setNewCharStoryline("");
    setNewCharLink("");
    setNewCharAvatar("👤");
    setNewCharTheme("rose");
    
    setIsAddModalOpen(false);
  };

  // Handle Editing Selected Character
  const handleUpdateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacter || !selectedCharacter.id) return;
    if (!editName.trim() || !editLink.trim()) {
      alert("Tên nhân vật và Đường dẫn liên kết không được để trống!");
      return;
    }

    let formattedLink = editLink.trim();
    if (!/^https?:\/\//i.test(formattedLink)) {
      formattedLink = "https://" + formattedLink;
    }

    const updatedChar: Character = enrichCharacter({
      ...selectedCharacter,
      name: editName.trim(),
      plot: editPlot.trim(),
      storyline: editStoryline.trim(),
      link: formattedLink,
      avatar: editAvatar.trim() || "👤",
      themeColor: editThemeColor,
    });

    const updatedList = characters.map(c => c && c.id === selectedCharacter.id ? updatedChar : c);
    setDoc(doc(db, "posts", updatedChar.id), updatedChar, { merge: true });
    setSelectedCharacter(updatedChar);
    setIsEditMode(false);
  };

  // Handle Deleting Character
  const handleDeleteCharacter = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Bạn có chắc chắn muốn xóa nhân vật này khỏi vũ trụ?")) {
      deleteDoc(doc(db, "posts", id));
      if (selectedCharacter?.id === id) {
        setSelectedCharacter(null);
      }
    }
  };

  // Handle Adding Feedback
  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacter || !selectedCharacter.id) return;
    if (!feedbackContent.trim()) return;

    const newFeedback = {
      id: "fb_" + Date.now(),
      author: feedbackAuthor.trim() || "Ẩn danh",
      content: feedbackContent.trim(),
      timestamp: new Date().toLocaleString("vi-VN"),
      rating: feedbackRating,
      avatar: feedbackAvatar,
      starRating: feedbackStarRating
    };

    const updatedFeedbacks = [...(selectedCharacter.feedbacks || []), newFeedback];
    const updatedCharacter = { ...selectedCharacter, feedbacks: updatedFeedbacks };
    
    const updatedList = characters.map(c => c && c.id === selectedCharacter.id ? updatedCharacter : c);
    
    setCharacters(updatedList);
    setSelectedCharacter(updatedCharacter);

    // Save to Firestore with setDoc merge to create document if it doesn't exist yet
    setDoc(doc(db, "posts", selectedCharacter.id), { feedbacks: updatedFeedbacks }, { merge: true }).catch(err => {
      console.error("Error saving feedback to Firestore:", err);
    });

    setFeedbackContent("");
    setFeedbackStarRating(5);
    showToast("Cảm ơn bạn đã để lại bình luận! ❤️");
    playMeowSound();
  };

  // Handle Deleting Feedback
  const handleDeleteFeedback = (feedbackId: string) => {
    if (!selectedCharacter || !selectedCharacter.id) return;
    const updatedFeedbacks = (selectedCharacter.feedbacks || []).filter(fb => fb.id !== feedbackId);
    const updatedCharacter = { ...selectedCharacter, feedbacks: updatedFeedbacks };
    const updatedList = characters.map(c => c && c.id === selectedCharacter.id ? updatedCharacter : c);
    
    setCharacters(updatedList);
    setSelectedCharacter(updatedCharacter);

    setDoc(doc(db, "posts", selectedCharacter.id), { feedbacks: updatedFeedbacks }, { merge: true }).catch(err => {
      console.error("Error deleting feedback from Firestore:", err);
    });

    showToast("Đã xóa bình luận!");
    playMeowSound();
  };

  // Toggle character favorite status
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playMeowSound();
    const updated = characters.map(c => {
      if (c && c.id === id) {
        const nextFav = !c.isFavorite;
        // Trigger a tiny heart confetti celebration on favoriting
        if (nextFav) {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 },
            colors: ["#f43f5e", "#fda4af", "#fff"]
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 },
            colors: ["#f43f5e", "#fda4af", "#fff"]
          });
          showToast(`Đã thêm ${c.name} vào danh sách yêu thích! ❤️`);
        } else {
          showToast(`Đã bỏ ${c.name} khỏi danh sách yêu thích 💔`);
        }
        return { ...c, isFavorite: nextFav };
      }
      return c;
    });
    setCharacters(updated);
    const favIds = updated.filter(c => c && c.isFavorite).map(c => c.id);
    localStorage.setItem("meomeo_favorites", safeJsonStringify(favIds));

    // If selected character is the one being favorited, update it too
    if (selectedCharacter && selectedCharacter.id === id) {
      setSelectedCharacter(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }
  };

  // Increment view count of a character and select it
  const handleSelectCharacter = (char: Character) => {
    if (!char || !char.id) return;
    if (char.id === "kaven-nyx") {
      setKavenLockedAlertOpen(true);
    }
    if (char.id === "kaiza-tachibana" || char.id === "tham-da") {
      setAgeVerification("pending");
    } else {
      setAgeVerification("verified"); // Default for other characters
    }

    const todayStr = new Date().toDateString(); // e.g. "Mon Aug 17 2026"
    
    // Quest logic
    try {
      localStorage.setItem(`quest_viewed_profile_${todayStr}`, "true");
    } catch(e) {
      console.error("Lỗi cập nhật quest:", e);
    }

    // Daily tracking logic: Reset local viewed array in localStorage if a new day has arrived.
    // This allows the same user to increment character views on subsequent days (no perpetual "rest" or block),
    // while preventing spam views by refreshing the page continuously within the same day.
    const lastViewedDate = localStorage.getItem("meomeo_last_viewed_date");
    let viewedIds = [];

    if (lastViewedDate !== todayStr) {
      localStorage.setItem("meomeo_last_viewed_date", todayStr);
      localStorage.setItem("meomeo_viewed_characters_v4", safeJsonStringify([]));
      viewedIds = [];
    } else {
      viewedIds = JSON.parse(localStorage.getItem("meomeo_viewed_characters_v4") || "[]");
    }
    
    if (!viewedIds.includes(char.id)) {
      // User hasn't viewed this character today, so we increment the global count in Firestore
      setDoc(doc(db, "posts", char.id), { views: increment(1) }, { merge: true }).catch(console.error);
      
      const updatedViewed = [...viewedIds, char.id];
      localStorage.setItem("meomeo_viewed_characters_v4", safeJsonStringify(updatedViewed));
      
      // Optimistic local update
      const newViews = (char.views || 0) + 1;
      setCharacters(prev => {
        const updated = prev.map(c => c.id === char.id ? { ...c, views: newViews } : c);
        return updated;
      });
      setSelectedCharacter({ ...char, views: newViews });
    } else {
      // Already viewed by this user today, just select it without incrementing again in this session/day
      setSelectedCharacter(char);
    }

    setIsEditMode(false);
  };

  // Select a random character
  const handleRandomCharacter = () => {
    if (characters.length === 0) return;
    const randomIndex = Math.floor(Math.random() * characters.length);
    handleSelectCharacter(characters[randomIndex]);
  };

  // Serve a random character with food-themed animation
  const handleServeDish = () => {
    if (characters.length === 0) return;
    setIsServing(true);
    setServedCharacter(null);
    setServingProgress(0);

    const steps = [
      "Meo Meo đang lau dọn đĩa bạc lấp lánh... 🧼✨",
      "Đang chọn nguyên liệu cốt truyện thơm ngon... 🍓📖",
      "Đang nêm nếm chút si tình ngọt ngào... 🍯💖",
      "Đang hâm nóng nhân vật bằng ngọn lửa siêu kịch tính... 🔥🎬",
      "Món ăn hoàng gia đặc biệt đã sẵn sàng! 👑🍽️"
    ];

    let currentStep = 0;
    setServingMessage(steps[0]);
    setServingProgress(15); // Start at 15% for step 0

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setServingMessage(steps[currentStep]);
        // Linear increase up to 100%
        const calculatedProgress = 15 + Math.round((currentStep / (steps.length - 1)) * 85);
        setServingProgress(Math.min(calculatedProgress, 100));
      } else {
        clearInterval(interval);
        setServingProgress(100);
        const randomIndex = Math.floor(Math.random() * characters.length);
        setServedCharacter(characters[randomIndex]);
        setIsServing(false);
      }
    }, 450);
  };

  // Filter and search characters
  const filteredCharacters = (() => {
    // 1. First, filter by search query
    let list = characters.filter(char => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        (char.name || "").toLowerCase().includes(query) ||
        (char.role || "").toLowerCase().includes(query) ||
        (char.plot || "").toLowerCase().includes(query) ||
        (char.storyline || "").toLowerCase().includes(query);
      
      return matchesSearch;
    });

    // 1.5 Filter by selectedCategory if it's not "Tất cả"
    if (selectedCategory !== "Tất cả") {
      list = list.filter(char => char.category === selectedCategory);
    }

    // 2. Filter by dropdown selection if it's "favorites"
    if (gridSortFilter === "favorites") {
      list = list.filter(char => !!char.isFavorite);
    }

    // 3. Sort by selection if it is "newest"
    if (gridSortFilter === "newest") {
      list = [...list].sort((a, b) => {
        const getTimestamp = (char: Character) => {
          if (!char || !char.id) return 0;
          if (char.id.startsWith("char_")) {
            const num = parseInt(char.id.replace("char_", ""), 10);
            return isNaN(num) ? 0 : num;
          }
          // Default characters have a lower timestamp, ordered by their position in DEFAULT_CHARACTERS
          const defaultIndex = DEFAULT_CHARACTERS.findIndex(c => c.id === char.id);
          return defaultIndex !== -1 ? 1000000 - defaultIndex : 0;
        };
        return getTimestamp(b) - getTimestamp(a);
      });
    } else if (gridSortFilter === "most_views") {
      list = [...list].sort((a, b) => (b.views || 0) - (a.views || 0));
    }

    return list;
  })();

  const top3Characters = [...characters]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 3);

  // Navigate to Link
  const handleGoToLink = (linkUrl: string) => {
    if (selectedCharacter && (selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected") {
      return;
    }
    window.open(linkUrl, "_blank", "noopener,noreferrer");
  };

  // Get matching theme details
  const getThemeDetails = (colorValue: string) => {
    const theme = PRESET_THEMES.find(t => t.value === colorValue);
    return theme || PRESET_THEMES[0];
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300 selection:bg-rose-200 selection:text-stone-800 ${
      !hasEntered ? "h-screen overflow-hidden" : ""
    } ${
      isDarkMode ? "bg-stone-950 text-stone-200" : "bg-[#ffeef2] text-stone-700"
    }`}>
      
      {/* Immersive Light Mode Sakura Landscape Background */}
      {!isDarkMode && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.16] pointer-events-none fixed"
          style={{ backgroundImage: `url(${lightSakuraBg})` }}
        />
      )}

      {/* Immersive Dark Mode Deep Pink Sakura Glow Overlay */}
      {isDarkMode && (
        <div className="absolute inset-0 z-0 pointer-events-none fixed">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25] pointer-events-none"
            style={{ backgroundImage: `url(${darkSunsetBalconyBg})` }}
          />
          {/* Soft magenta/hot-pink glowing radial gradients in the corners to create a vivid contrast with the dark burgundy base */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,105,180,0.12),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(224,73,114,0.1),transparent_70%)]" />
          {/* Subtle warm rose center vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.03),transparent_80%)]" />
        </div>
      )}

      {/* Foreground subtle falling tiny particle overlay */}
      <ParticleOverlay isDarkMode={isDarkMode} />

      {/* Welcome / Entry Loading Screen */}
      <AnimatePresence>
        {!hasEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              scale: 1.08,
              filter: "blur(12px)",
              transition: { duration: 0.55, ease: "easeInOut" }
            }}
            onClick={() => {
              if (loadingProgress < 100) return;
              playMeowSound();
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.7 },
                colors: ["#f43f5e", "#fda4af", "#ffffff", "#fb7185", "#fbbf24"]
              });
              setHasEntered(true);
              sessionStorage.setItem("hasEntered", "true");
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
          >
            {/* Immersive Background matching active theme mode */}
            {isDarkMode ? (
              <div className="absolute inset-0 transition-all duration-500">
                <div className="absolute inset-0 bg-stone-950" />
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.38] pointer-events-none"
                  style={{ backgroundImage: `url(${darkSunsetBalconyBg})` }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,105,180,0.15),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(224,73,114,0.12),transparent_70%)]" />
              </div>
            ) : (
              <div className="absolute inset-0 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ffeef2] via-[#ffdcd3] to-[#ffeef2]" />
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.3] pointer-events-none"
                  style={{ backgroundImage: `url(${lightSakuraBg})` }}
                />
              </div>
            )}

            {/* Glowing orbs - Only in Light Mode */}
            {!isDarkMode && (
              <>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-rose-400/10 blur-3xl animate-pulse pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl animate-pulse pointer-events-none" />

                {/* Immersive animated background highlights */}
                <motion.div 
                  className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 30%, rgba(244,63,94,0.15) 0%, transparent 60%)",
                      "radial-gradient(circle at 80% 70%, rgba(251,191,36,0.15) 0%, transparent 60%)",
                      "radial-gradient(circle at 20% 30%, rgba(244,63,94,0.15) 0%, transparent 60%)",
                    ]
                  }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}

            {/* Decorative Grid Lines - Beautiful White Square Grid */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
              isDarkMode
                ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)]"
                : "bg-[linear-gradient(to_right,rgba(255,255,255,0.65)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.65)_1px,transparent_1px)]"
            } bg-[size:2.5rem_2.5rem]`} />

            {/* Falling Sparks & Magic Dust */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {loadingSparkles.map((p) => {
                let pathD = "M10 0 L13 7 L20 10 L13 13 L10 20 L7 13 L0 10 L7 7 Z"; // default star
                let viewBox = "0 0 20 20";
                
                if (p.type === "diamond") {
                  pathD = "M10 0 L20 10 L10 20 L0 10 Z";
                  viewBox = "0 0 20 20";
                } else if (p.type === "heart") {
                  pathD = "M12 21.35 l-1.45-1.32 C5.4 15.36 2 12.28 2 8.5 C2 5.42 4.42 3 7.5 3 c1.74 0 3.41 .81 4.5 2.09 C13.09 3.81 14.76 3 16.5 3 C19.58 3 22 5.42 22 8.5 c0 3.78-3.4 6.86-8.55 11.54 L12 21.35 z";
                  viewBox = "0 0 24 24";
                } else if (p.type === "sparkle") {
                  pathD = "M12 2 C12 7.5 16.5 12 22 12 C16.5 12 12 16.5 12 22 C12 16.5 7.5 12 2 12 C7.5 12 12 7.5 12 2 Z";
                  viewBox = "0 0 24 24";
                }
                
                return (
                  <motion.div
                    key={p.id}
                    className="absolute"
                    style={{
                      left: p.left,
                      width: p.size,
                      height: p.size,
                      top: -40,
                    }}
                    initial={{ y: "-10vh", opacity: 0, rotate: 0 }}
                    animate={{
                      y: "115vh",
                      x: p.drift,
                      opacity: [0, 0.9, 0.9, 0],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      delay: p.delay,
                      ease: "linear",
                    }}
                  >
                    <svg viewBox={viewBox} fill={p.color} className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                      <path d={pathD} />
                    </svg>
                  </motion.div>
                );
              })}
            </div>

            {/* Floating footprints to guide the eye */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ 
                    opacity: 0.15, 
                    scale: 0.6, 
                    x: Math.random() * 400 - 200, 
                    y: Math.random() * 400 - 200,
                    rotate: Math.random() * 360
                  }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 5, 0],
                    opacity: [0.15, 0.4, 0.15]
                  }}
                  transition={{
                    duration: 4 + idx * 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`absolute ${
                    idx === 0 ? "top-10 left-10" :
                    idx === 1 ? "bottom-20 left-1/4" :
                    idx === 2 ? "top-1/3 right-12" :
                    idx === 3 ? "bottom-1/3 left-12" :
                    idx === 4 ? "top-1/4 right-1/3" : "bottom-12 right-24"
                  }`}
                >
                  <PawPrint className={`w-8 h-8 ${isDarkMode ? "text-rose-950/40" : "text-rose-100/50"}`} />
                </motion.div>
              ))}
            </div>

            {/* Glass Container */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.65, ease: "easeOut" }}
              className={`max-w-md w-11/12 p-8 rounded-3xl border text-center relative z-10 backdrop-blur-xl shadow-2xl transition-colors duration-500 flex flex-col items-center gap-6 ${
                isDarkMode 
                  ? "bg-stone-900/50 border-stone-800/80 shadow-rose-950/10" 
                  : "bg-white/60 border-[#eadbca]/50 shadow-rose-100/30"
              }`}
            >
              {/* Outer pulsing ring */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-xl animate-ping" />
                <motion.div 
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: 6,
                    boxShadow: "0 10px 25px -5px rgba(244, 63, 94, 0.4)"
                  }}
                  whileTap={{ scale: 0.93 }}
                  animate={{
                    scale: [1, 1.06, 0.98, 1.06, 1],
                  }}
                  transition={{
                    scale: {
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                  className={`w-24 h-24 rounded-full border-4 border-white shadow-xl cursor-pointer select-none overflow-hidden bg-white flex items-center justify-center shrink-0`}
                >
                  <img 
                    src="https://i.pinimg.com/736x/36/48/33/364833d967cb0920bd05c4035ff58d4a.jpg" 
                    alt="Người Lười Tạo Bot Avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full transition-transform duration-300"
                  />
                </motion.div>
                
                {/* Micro Sparkles */}
                <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-bounce" />
                <Heart className="absolute -bottom-1 -left-1 w-4 h-4 text-rose-400 animate-pulse" />
              </div>

              {/* Title Block */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.3em] text-rose-500 font-bold font-mono">
                  FB: Người Lười Tạo Bot
                </span>
                <h2 className={`text-2xl sm:text-3xl font-serif font-semibold tracking-tight transition-colors duration-300 ${
                  isDarkMode ? "text-stone-100" : "text-stone-800"
                }`}>
                  Món Ăn Tại Đây
                </h2>
                <p className={`text-xs max-w-xs mx-auto transition-colors duration-300 ${
                  isDarkMode ? "text-stone-400" : "text-stone-500"
                }`}>
                  Mời thưởng thức món ăn. Chúc ngon miệng hehe
                </p>
              </div>

              {/* Loader bars */}
              <div className="w-full space-y-2">
                <div className={`h-1.5 w-full rounded-full overflow-hidden relative ${
                  isDarkMode ? "bg-stone-800" : "bg-stone-100"
                }`}>
                  <div 
                    style={{ 
                      width: `${loadingProgress}%`,
                      willChange: "width" 
                    }}
                    className={`h-full rounded-full transition-all duration-150 ease-out ${
                      isDarkMode ? "bg-stone-500" : "bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono opacity-60">
                  <span>{loadingProgress < 100 ? "ĐANG TẢI HỆ THỐNG..." : "HỆ THỐNG ĐÃ SẴN SÀNG"}</span>
                  <span>{loadingProgress}%</span>
                </div>
              </div>

              {/* Call to action button */}
              <motion.div
                animate={loadingProgress === 100 ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className={`w-full py-3.5 px-6 rounded-2xl font-serif font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border shadow-sm ${
                  loadingProgress < 100
                    ? (isDarkMode ? "bg-stone-900/40 text-stone-600 border-stone-800 cursor-not-allowed" : "bg-stone-50 text-stone-400 border-stone-200 cursor-not-allowed")
                    : (isDarkMode
                        ? `${currentPastel.primaryBgDark} ${currentPastel.primaryText} ${currentPastel.primaryBorderDark} hover:bg-stone-900`
                        : `${currentPastel.primaryBgLight} ${currentPastel.primaryText} ${currentPastel.primaryBorderLight} hover:opacity-90`)
                }`}
              >
                <span>{loadingProgress < 100 ? `🐾 Đang bày biện bàn ăn... (${loadingProgress}%) 🐾` : "🐾 Nhấp vào đây nè , meo meo 🐾"}</span>
              </motion.div>
            </motion.div>

            {/* Subtle disclaimer in footer */}
            <span className="absolute bottom-6 text-[10px] tracking-wide opacity-40 font-serif">
              meomeokitty • Kính coong!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative starry ambient background with dynamic pastel glow */}
      <CatPawsBackground />
      <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${currentPastel.glow}`} />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(231,212,194,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(231,212,194,0.15)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Top Header / Portal Navbar */}
      <header className={`border-b sticky top-0 backdrop-blur-md z-40 px-4 sm:px-12 py-3.5 flex justify-between items-center shadow-sm transition-all duration-300 ${
        isDarkMode 
          ? "border-stone-800 bg-stone-950/95 text-stone-100 shadow-stone-950/40" 
          : "border-[#eadbca]/50 bg-[#ffeef2]/95 text-stone-800 shadow-stone-100/40"
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-inner transition-colors duration-300 overflow-hidden shrink-0 ${
            isDarkMode ? `border-stone-800 ${currentPastel.primaryBgDark}` : `${currentPastel.primaryBorderLight} ${currentPastel.primaryBgLight}`
          }`}>
            <img 
              src="https://i.pinimg.com/736x/71/12/9c/71129cede910df9393dcdc871cb76a10.jpg" 
              alt="meomeokitty" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <div className={`text-base font-serif italic font-semibold tracking-wider transition-colors duration-300 ${
              isDarkMode ? "text-stone-100" : "text-stone-800"
            }`}>
              meomeokitty
            </div>
            <button
              type="button"
              onClick={() => {
                playMeowSound();
                setIsDonateModalOpen(true);
              }}
              className={`mt-0.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border transition-all duration-200 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 group shrink-0 ${
                isDarkMode
                  ? "bg-rose-950/60 border-rose-800/80 text-rose-300 hover:bg-rose-900/70 hover:border-rose-600 shadow-rose-950/30"
                  : "bg-rose-50/90 border-rose-200/90 text-rose-600 hover:bg-rose-100 hover:border-rose-300 shadow-rose-100/50"
              }`}
              title="Đô na tê ủng hộ tui ở đây 💖"
            >
              <Heart className="w-2.5 h-2.5 text-rose-500 animate-pulse fill-rose-500 group-hover:scale-110 transition-transform shrink-0" />
              <span className="whitespace-nowrap">Đô na tê ủng hộ tui ở đây</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto py-1 justify-center sm:justify-start">
          {/* Navigation Tab Switcher */}
          <div className={`grid grid-cols-2 gap-1.5 sm:flex sm:items-center sm:gap-0 p-1.5 sm:p-1 rounded-[1.25rem] sm:rounded-full border text-[10.5px] sm:text-xs font-bold font-mono transition-colors w-full sm:w-auto ${
            isDarkMode ? "bg-stone-900 border-stone-800" : "bg-stone-100 border-stone-200"
          }`}>
            <button
              onClick={() => {
                setActiveTab("repository");
                playMeowSound();
              }}
              className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-[1rem] sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === "repository"
                  ? isDarkMode
                    ? "bg-rose-950 text-rose-300 border border-rose-800 shadow-sm"
                    : "bg-white text-rose-600 border border-rose-200 shadow-sm"
                  : isDarkMode
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline whitespace-nowrap">Kho Nhân Vật</span>
              <span className="inline sm:hidden whitespace-nowrap">Kho</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("chat");
                playMeowSound();
              }}
              className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-[1rem] sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === "chat"
                  ? isDarkMode
                    ? "bg-amber-950 text-amber-300 border border-amber-800 shadow-sm"
                    : "bg-white text-amber-700 border border-amber-200 shadow-sm"
                  : isDarkMode
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>💬</span>
              <span className="hidden sm:inline whitespace-nowrap">Chat Riêng</span>
              <span className="inline sm:hidden whitespace-nowrap">Chat</span>
              <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-300 px-1 rounded-full">💸</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("suggestions");
                playMeowSound();
              }}
              className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-[1rem] sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === "suggestions"
                  ? isDarkMode
                    ? "bg-purple-950 text-purple-300 border border-purple-800 shadow-sm"
                    : "bg-white text-purple-600 border border-purple-200 shadow-sm"
                  : isDarkMode
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>💡</span>
              <span className="hidden sm:inline whitespace-nowrap">Góp Ý Tưởng</span>
              <span className="inline sm:hidden whitespace-nowrap">Góp Ý</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("playground");
                playMeowSound();
              }}
              className={`px-2 py-2 sm:px-3 sm:py-1.5 rounded-[1rem] sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === "playground"
                  ? isDarkMode
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800 shadow-sm"
                    : "bg-white text-emerald-600 border border-emerald-200 shadow-sm"
                  : isDarkMode
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <span>🎮</span>
              <span className="hidden sm:inline whitespace-nowrap">Khu Vui Chơi</span>
              <span className="inline sm:hidden whitespace-nowrap">Chơi</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("support");
                playMeowSound();
                setHasNewSupportPost(false);
                localStorage.setItem("meomeo_last_viewed_support_time", Date.now().toString());
              }}
              className={`relative px-2 py-2 sm:px-3 sm:py-1.5 rounded-[1rem] sm:rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0 ${
                activeTab === "support"
                  ? isDarkMode
                    ? "bg-rose-950 text-rose-300 border border-rose-800 shadow-sm"
                    : "bg-white text-rose-600 border border-rose-200 shadow-sm"
                  : isDarkMode
                  ? "text-stone-400 hover:text-stone-200"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              {hasNewSupportPost && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-stone-900 animate-pulse z-10" />
              )}
              <span>🌸</span>
              <span className="hidden sm:inline whitespace-nowrap">Góc Hỗ Trợ</span>
              <span className="inline sm:hidden whitespace-nowrap">Hỗ Trợ</span>
            </button>


          </div>






          <UserProfile isDarkMode={isDarkMode} />
        </div>
        
        {/* Scroll Progress Bar at bottom of sticky header with active pastel theme gradient */}
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-500 ${
            isDarkMode ? "bg-stone-700" : `bg-gradient-to-r ${currentPastel.accentGradient}`
          }`}
        />
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10 w-full z-10">
        {activeTab === "chat" ? (
          <CharacterChatView
            characters={characters}
            selectedCharacterId={chatCharacterId}
            onBackToGrid={() => setActiveTab("repository")}
            isDarkMode={isDarkMode}
          />
        ) : activeTab === "suggestions" ? (
          <CharacterIdeaSuggestions 
            isDarkMode={isDarkMode}
            currentPastel={currentPastel}
          />
        ) : activeTab === "playground" ? (
          <PlaygroundZone
            characters={characters}
            isDarkMode={isDarkMode}
            onBackToGrid={() => setActiveTab("repository")}
          />
        ) : activeTab === "support" ? (
          <SupportCorner />
        ) : (
          <>
            {/* Dynamic Hero Description */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="text-[9px] uppercase tracking-[0.3em] text-rose-500 font-bold mb-2 block font-mono">
            FB: Người Lười Tạo Bot 🐾🌸
          </span>
          <h1 className={`text-3xl sm:text-4xl font-serif font-light mb-4 tracking-tight font-semibold transition-colors duration-300 ${
            isDarkMode ? "text-stone-100" : "text-stone-800"
          }`}>
            Thế Giới Nhỏ Của Người Lười Tạo Bot ✨🌸
          </h1>
          <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto transition-colors duration-300 ${
            isDarkMode ? "text-stone-400" : "text-stone-500"
          }`}>
            Nếu các nàng gặp bất kỳ vấn đề gì, cứ nhắn tui nhen, tui online 24/7 để ôm và lắng nghe nàng nè. Kính coong kính coong! 🔔🎀
          </p>
        </div>

        {/* Dedicated "Contact tui ở đây" Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ 
            y: -2,
            boxShadow: isDarkMode 
              ? "none" 
              : "0 12px 30px -10px rgba(244, 63, 94, 0.15)"
          }}
          className={`mb-12 border p-6 relative overflow-hidden rounded-2xl shadow-xs transition-all duration-300 max-w-md mx-auto text-center cursor-default ${
            isDarkMode 
              ? "bg-stone-900 border-stone-800 text-stone-200" 
              : "bg-[#fffdfb] border-[#ebdccb]/60 text-stone-800 shadow-[0_4px_24px_rgba(244,180,190,0.05)]"
          }`}
        >
          {/* Decorative Sparkle Icons */}
          <div className="absolute top-3 left-3 opacity-20">
            <Sparkles className="w-4 h-4 text-pink-400 dark:text-purple-400 animate-pulse" />
          </div>
          <div className="absolute bottom-3 right-3 opacity-20" style={{ animationDelay: "1s" }}>
            <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-300 animate-pulse" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className={`text-[10px] font-sans font-bold tracking-[0.2em] uppercase px-3.5 py-1 rounded-full border shadow-2xs ${
              isDarkMode 
                ? "bg-purple-950/60 border-purple-900/40 text-purple-300" 
                : "bg-pink-50 border-pink-100 text-rose-600"
            }`}>
              💌 Góc Liên Hệ Siêu Đáng Yêu
            </div>

            <p className={`text-xs leading-relaxed max-w-[320px] transition-colors duration-300 ${
              isDarkMode ? "text-purple-200/80" : "text-stone-600"
            }`}>
              Bất kỳ lúc nào nàng cần hỗ trợ, gặp lỗi bot hay muốn thầm thì góp ý gì thì cứ gõ cửa nhà tui nhaa nheaa~ 🐾🍼
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-[340px]">
              <UserProfile isDarkMode={isDarkMode} variant="block" />
              
              <a 
                href="https://discord.gg/f9GQa239b"
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold tracking-wider transition-all duration-300 cursor-pointer shadow-xs select-none w-full ${
                  isDarkMode 
                    ? "bg-purple-950/60 border-purple-800/70 hover:border-purple-600 text-purple-200 hover:text-white hover:bg-purple-900/80 shadow-purple-950/40" 
                    : "bg-purple-100/90 border-purple-200/90 hover:bg-purple-200/80 hover:border-purple-300 text-purple-800 shadow-purple-100/60"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 127.14 96.36" className="w-4.5 h-4.5 shrink-0 fill-current text-purple-500" xmlns="http://www.w3.org/2000/svg">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.88-.65,1.72-1.33,2.53-2a75.78,75.78,0,0,0,72.9,0c.81.71,1.65,1.39,2.53,2a75.78,75.78,0,0,0,31-18.83C129,54.65,123.48,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                  </svg>
                  <span>Giao lưu với tụi mình ở đây</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>

              <a 
                href="https://www.facebook.com/profile.php?id=61590680071217"
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-sm select-none w-full ${
                  isDarkMode 
                    ? "bg-stone-950 border-stone-800 hover:border-purple-800/80 text-purple-300 hover:text-purple-200 hover:bg-purple-950/30" 
                    : "bg-white border-pink-200 hover:border-pink-300 text-rose-600 hover:bg-rose-50/80 hover:text-rose-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 fill-[#1877F2]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Người Lười Tạo Bot (Facebook)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </a>

              <a 
                href="https://discord.com/users/1523153767250264227"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={(e) => {
                  // Fallback copy to clipboard when clicked if popup is blocked
                  navigator.clipboard?.writeText("https://discord.com/users/1523153767250264227");
                }}
                className={`inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer shadow-sm select-none w-full ${
                  isDarkMode 
                    ? "bg-stone-950 border-stone-800 hover:border-purple-800/80 text-purple-300 hover:text-purple-200 hover:bg-purple-950/30" 
                    : "bg-white border-pink-200 hover:border-pink-300 text-rose-600 hover:bg-rose-50/80 hover:text-rose-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 127.14 96.36" className="w-4 h-4 shrink-0 fill-[#5865F2]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.88-.65,1.72-1.33,2.53-2a75.78,75.78,0,0,0,72.9,0c.81.71,1.65,1.39,2.53,2a75.78,75.78,0,0,0,31-18.83C129,54.65,123.48,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                  </svg>
                  <span>Hae Aeni (Discord cá nhân)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 opacity-60 shrink-0" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Meo Meo Diner - Dedicated Random Food Platter Station */}
        <div className={`mb-12 border p-6 sm:p-8 relative overflow-hidden rounded-2xl shadow-sm transition-all duration-300 ${
          isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-[#eadbca]/50 text-stone-700"
        }`}>
          {/* Background sparkles decoration */}
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            isDarkMode ? "bg-rose-950/20" : "bg-rose-100/30"
          }`} />
          <div className={`absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
            isDarkMode ? "bg-amber-950/20" : "bg-amber-100/30"
          }`} />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 mt-1 animate-pulse border transition-colors duration-300 ${
                isDarkMode ? "bg-rose-950/40 border-rose-900/60" : "bg-rose-50 border-rose-200"
              }`}>
                <ChefHat className="w-6 h-6 text-rose-500" />
              </div>
              <div>
                <h2 className={`text-lg font-serif font-light tracking-wide flex items-center gap-2 font-semibold transition-colors duration-300 ${
                  isDarkMode ? "text-stone-100" : "text-stone-800"
                }`}>
                  🍽️ Góc Phục Vụ Bé Cưng Ngẫu Nhiên
                  <span className={`text-[10px] uppercase font-mono tracking-widest border px-2.5 py-0.5 rounded-full font-bold transition-all duration-300 ${
                    isDarkMode ? "text-rose-400 bg-rose-950/40 border-rose-900" : "text-rose-600 bg-rose-50 border-rose-200/60"
                  }`}>MEOW MEOW DINER</span>
                </h2>
                <p className={`text-xs mt-1 leading-relaxed max-w-xl transition-colors duration-300 ${
                  isDarkMode ? "text-stone-400" : "text-stone-500"
                }`}>
                  Hãy để Meo Meo bưng lên một em  ngẫu nhiên cho các nàng thưởng thức thử nhe~ 🐾🍯
                </p>
              </div>
            </div>

            {/* Serve Button */}
            {!isServing && !servedCharacter && (
              <div className="relative">
                {/* Behind Glow pulsing effect */}
                {!isDarkMode && (
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-rose-500/20 blur-md pointer-events-none"
                  />
                )}

                {/* Idle floating sparkles */}
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`idle-${i}`}
                      initial={{ opacity: 0, scale: 0, y: 10, x: i * 30 - 30 }}
                      animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0.5, 1, 0.5],
                        y: -35 - Math.random() * 15,
                        x: i * 40 - 40 + (Math.random() * 20 - 10),
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeInOut",
                      }}
                      className="absolute top-1/2 left-1/2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300/50" />
                    </motion.div>
                  ))}
                </div>

                {/* Click Sparkles list */}
                <AnimatePresence>
                  {buttonSparkles.map((sp) => (
                    <motion.div
                      key={sp.id}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                      animate={{ 
                        x: sp.x, 
                        y: sp.y, 
                        opacity: [0, 1, 1, 0], 
                        scale: [0, 1.3, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="absolute pointer-events-none z-50 flex items-center justify-center"
                      style={{ 
                        left: "50%", 
                        top: "50%",
                        marginLeft: -sp.size / 2,
                        marginTop: -sp.size / 2,
                      }}
                    >
                      <Sparkles 
                        style={{ color: sp.color, width: sp.size, height: sp.size }} 
                        className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    triggerBlingBling();
                    handleServeDish();
                  }}
                  className={`px-6 py-3 border transition-all text-xs font-mono uppercase tracking-widest flex items-center gap-2 shrink-0 shadow-md cursor-pointer relative overflow-hidden group rounded-full font-bold ${
                    isDarkMode 
                      ? "bg-stone-900 hover:bg-stone-800 border-stone-800 text-stone-200" 
                      : "bg-gradient-to-r from-rose-100 to-amber-100 hover:from-rose-200 hover:to-amber-200 border border-rose-200 text-stone-800"
                  }`}
                >
                  <Utensils className="w-4 h-4 text-rose-500 animate-bounce" />
                  <span className="relative z-10 flex items-center gap-1">
                    Quay ngẫu nhiên món ăn ở đây
                  </span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Cooking/Serving State */}
          {isServing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-6 p-6 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-5 transition-colors duration-300 ${
                isDarkMode ? "border-rose-900/60 bg-rose-950/10" : "border-rose-300/60 bg-rose-50/40"
              }`}
            >
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 animate-spin flex items-center justify-center ${
                  isDarkMode ? "border-rose-900 border-t-rose-500" : "border-rose-200 border-t-rose-500"
                }`}>
                  <ChefHat className="w-6 h-6 text-rose-500 animate-bounce" />
                </div>
                <Sparkles className="w-4 h-4 text-rose-400 absolute -top-1 -right-1 animate-ping" />
              </div>
              <div className="w-full max-w-md">
                <p className={`text-sm font-serif italic font-medium animate-pulse min-h-[20px] mb-2 ${
                  isDarkMode ? "text-stone-300" : "text-stone-700"
                }`}>{servingMessage}</p>
                
                {/* Visual Progress Bar */}
                <div className={`relative w-full h-2 overflow-hidden rounded-full border my-3 transition-colors duration-300 ${
                  isDarkMode ? "bg-stone-950 border-stone-800" : "bg-stone-100 border-stone-200"
                }`}>
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${servingProgress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className={`h-full rounded-full relative ${
                      isDarkMode ? "bg-stone-500" : "bg-gradient-to-r from-amber-300 to-rose-400"
                    }`}
                  >
                    {/* Glowing beam effect running inside - Only in Light Mode */}
                    {!isDarkMode && (
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-2/3 h-full animate-[shimmer_1.5s_infinite] -skew-x-12" />
                    )}
                  </motion.div>
                </div>
                
                <div className={`flex justify-between items-center text-[10px] font-mono uppercase tracking-widest mt-1 ${
                  isDarkMode ? "text-stone-500" : "text-stone-400"
                }`}>
                  <span>Đang chế biến tinh hoa món ăn phục vụ khách hàng...</span>
                  <span className="text-rose-500 font-bold">{servingProgress}%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Served Character Result Card */}
          {servedCharacter && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 border p-5 sm:p-6 rounded-2xl shadow-sm transition-colors duration-300 ${
                isDarkMode ? "border-rose-900 bg-rose-950/10" : "border-rose-200 bg-rose-50/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                
                {/* Character Platter Preview */}
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ scale: 0.7, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 14 }}
                    className={`text-4xl sm:text-5xl shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full aspect-square flex items-center justify-center shadow-inner relative overflow-hidden border transition-colors duration-300 ${
                      isDarkMode ? "bg-stone-950 border-rose-900" : "bg-white border-rose-200"
                    }`}
                  >
                    {isImageUrl(servedCharacter.avatar) ? (
                      <img 
                        src={formatImageUrl(servedCharacter.avatar)} 
                        alt={servedCharacter.name} 
                        className="w-full h-full object-cover aspect-square rounded-full shrink-0" 
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, servedCharacter.name)}
                      />
                    ) : (
                      <span>{servedCharacter.avatar}</span>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-rose-400 text-stone-900 dark:text-white text-[8px] px-1.5 py-0.5 font-mono font-bold rounded-full uppercase z-10">SERVED</span>

                    {/* Ring of magical floating sparkles for celebration */}
                    {[...Array(6)].map((_, i) => {
                      const angle = (i * 360) / 6;
                      const rad = (angle * Math.PI) / 180;
                      const distance = 42;
                      const x = Math.cos(rad) * distance;
                      const y = Math.sin(rad) * distance;
                      return (
                        <motion.div
                          key={`served-sparkle-${i}`}
                          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1.2, 0.8, 0],
                            x: [0, x],
                            y: [0, y],
                          }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            repeatDelay: 0.8,
                            delay: i * 0.15,
                            ease: "easeOut",
                          }}
                          className="absolute"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-rose-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]" />
                        </motion.div>
                      );
                    })}
                  </motion.div>
                  <div>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-rose-500 font-bold block">Đã ra lò món ngon do Meo Meo làm , mời thưởng thức</span>
                    <h3 className={`text-xl font-serif mt-0.5 flex items-center gap-2 font-semibold transition-colors duration-300 ${
                      isDarkMode ? "text-stone-100" : "text-stone-800"
                    }`}>
                      {servedCharacter.name}
                    </h3>
                    <p className="text-xs text-rose-500 font-medium tracking-wide mt-1">{servedCharacter.role}</p>
                    <p className={`text-xs line-clamp-2 mt-2 italic max-w-xl transition-colors duration-300 ${
                      isDarkMode ? "text-stone-300" : "text-stone-600"
                    }`}>
                      "{servedCharacter.plot}"
                    </p>
                  </div>
                </div>

                {/* Restaurant Bill / Action items */}
                <div className={`flex flex-row sm:flex-col gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6 transition-colors duration-300 ${
                  isDarkMode ? "border-stone-800" : "border-stone-200"
                }`}>
                  <button
                    onClick={() => {
                      playMeowSound();
                      handleSelectCharacter(servedCharacter);
                    }}
                    className={`flex-1 sm:w-full px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all font-bold text-center flex items-center justify-center gap-1.5 cursor-pointer rounded-full shadow-sm hover:shadow ${
                      isDarkMode 
                        ? "bg-amber-950/80 hover:bg-amber-900 text-amber-200" 
                        : "bg-amber-200 hover:bg-amber-300 text-amber-900"
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Tìm Hiểu Bé Yêu 📖</span>
                  </button>

                  <div className="flex gap-2 flex-1 sm:w-full">
                    <button
                      onClick={handleServeDish}
                      className={`flex-1 px-3 py-2 border text-xs font-mono uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1 cursor-pointer rounded-full shadow-xs ${
                        isDarkMode 
                          ? "border-rose-900 bg-stone-900 hover:bg-rose-950/40 text-rose-300" 
                          : "border-rose-200 bg-white hover:bg-rose-50 text-stone-600 hover:text-rose-600"
                      }`}
                    >
                      <span>Đổi Bé Khác 🔁</span>
                    </button>
                    <button
                      onClick={() => setServedCharacter(null)}
                      className={`px-3 py-2 border text-xs font-mono transition-all text-center flex items-center justify-center cursor-pointer rounded-full ${
                        isDarkMode 
                          ? "border-stone-800 bg-stone-900 hover:bg-red-950/20 text-stone-500 hover:text-red-400" 
                          : "border-stone-200 bg-white hover:bg-red-50 text-stone-400 hover:text-red-500"
                      }`}
                      title="Cất bé đi nhen 📦"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </div>



        {/* Filters, Categories and Search */}
        <div className={`mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b transition-colors duration-300 ${
          isDarkMode ? "border-stone-800" : "border-[#eadbca]/30"
        }`}>
          {/* Custom styled search input & Favorite Button Group */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhân vật nàng iu muốn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-10 py-2.5 text-xs sm:text-sm font-serif italic tracking-wide rounded-full shadow-xs transition-colors duration-300 ${
                  isDarkMode 
                    ? `bg-stone-900 border-stone-800 text-stone-100 placeholder-stone-500 ${currentPastel.focusRing}` 
                    : `bg-white border-[#eadbca]/60 text-stone-800 placeholder-stone-400 focus:outline-none ${currentPastel.focusRing}`
                }`}
                id="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <select
                value={gridSortFilter}
                onChange={(e) => {
                  playMeowSound();
                  setGridSortFilter(e.target.value as any);
                }}
                className={`px-5 py-2.5 text-[9px] tracking-widest uppercase font-mono font-bold transition-all border cursor-pointer rounded-full focus:outline-none ${
                  isDarkMode
                    ? `bg-stone-900 text-stone-300 border-stone-800 hover:${currentPastel.primaryText}`
                    : `bg-white text-stone-700 border-[#eadbca]/60 hover:${currentPastel.primaryText}`
                }`}
                title="Sắp xếp & lọc danh sách bé yêu"
              >
                <option value="all">✨ Tất Cả Các Bé Yêu</option>
                <option value="favorites">❤️ Các Bé Đã Thả Tim</option>
                <option value="newest">🆕 Gương Mặt Mới Toanh</option>
                <option value="most_views">🔥 Được Cưng Chiều Nhất</option>
              </select>
            </div>

            <AnimatePresence>
              {(searchQuery !== "" || gridSortFilter !== "all" || selectedCategory !== "Tất cả") && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  onClick={() => {
                    playMeowSound();
                    setSearchQuery("");
                    setGridSortFilter("all");
                    setSelectedCategory("Tất cả");
                  }}
                  className={`px-4 py-2.5 text-[9px] tracking-widest uppercase font-mono font-bold border rounded-full flex items-center gap-1.5 shrink-0 transition-all shadow-sm cursor-pointer ${
                    isDarkMode
                      ? `bg-stone-900 ${currentPastel.primaryText} ${currentPastel.primaryBorderDark} hover:bg-stone-800`
                      : `${currentPastel.primaryBgLight} ${currentPastel.primaryText} ${currentPastel.primaryBorderLight} hover:opacity-90`
                  }`}
                  title="Xóa tất cả bộ lọc"
                >
                  <X className="w-3 h-3" />
                  XÓA BỘ LỌC
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SECTION 1: HỒ SƠ NHÂN VẬT (Character Profiles Grid) */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${currentPastel.primaryText}`} />
              <h2 className={`text-base sm:text-lg font-bold uppercase tracking-wider font-sans ${isDarkMode ? "text-stone-100" : "text-stone-800"}`}>
                Danh Sách Bé Yêu 🌸
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-bold">
                {filteredCharacters.length} em bé
              </span>
            </div>
          </div>

          {/* Categorization Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "none" }}>
            {CHARACTER_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    playMeowSound();
                    setSelectedCategory(cat);
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-full shrink-0 transition-all cursor-pointer shadow-xs snap-start ${
                    isActive
                      ? isDarkMode
                        ? "bg-rose-500 text-white shadow-md border-rose-400"
                        : "bg-rose-400 text-white shadow-md border-rose-300"
                      : isDarkMode
                        ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-white"
                        : "bg-white border-[#eadbca]/50 text-stone-600 hover:bg-rose-50 hover:text-rose-500"
                  } border`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {filteredCharacters.length === 0 ? (
            <div className={`p-12 text-center border border-dashed rounded-2xl transition-colors duration-300 ${
              isDarkMode ? "border-stone-800 text-stone-400" : "border-[#eadbca] text-stone-500"
            }`}>
              <p className="text-sm font-serif italic mb-3">Không tìm thấy nhân vật nào phù hợp với tìm kiếm của nàng...</p>
              <button
                onClick={() => {
                  playMeowSound();
                  setSearchQuery("");
                  setGridSortFilter("all");
                }}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-full border transition-all cursor-pointer ${
                  isDarkMode ? "border-stone-700 hover:bg-stone-800 text-stone-200" : "border-stone-300 hover:bg-stone-100 text-stone-700"
                }`}
              >
                Xóa bộ lọc tìm kiếm 🔄
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((char, idx) => (
                <CharacterCard
                  key={char.id}
                  char={char}
                  idx={idx}
                  onSelect={() => handleSelectCharacter(char)}
                  onStartChat={() => {
                    if (char.id === "kaven-nyx") {
                      setKavenLockedAlertOpen(true);
                      return;
                    }
                    setChatCharacterId(char.id);
                    setActiveTab("chat");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onEdit={() => {
                    if (char.id === "kaven-nyx") {
                      setKavenLockedAlertOpen(true);
                      return;
                    }
                    setSelectedCharacter(char);
                    setIsEditMode(true);
                  }}
                  onDelete={(e) => {
                    if (char.id === "kaven-nyx") {
                      e.stopPropagation();
                      setKavenLockedAlertOpen(true);
                      return;
                    }
                    handleDeleteCharacter(char.id, e);
                  }}
                  onToggleFavorite={(e) => handleToggleFavorite(char.id, e)}
                  getThemeDetails={getThemeDetails}
                  isDarkMode={isDarkMode}
                  onNoLinkClick={() => {
                    if (char.id === "kaven-nyx") {
                      setKavenLockedAlertOpen(true);
                    } else {
                      setNoLinkAlertOpen(true);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: KHU VỰC TƯƠNG TÁC & LEAK THÓI QUEN XẤU MẤY ẺM */}
        <section className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 mb-12 ${
          isDarkMode 
            ? "bg-stone-900/40 border-stone-800/80" 
            : "bg-white/80 border-[#f2e3e3] shadow-sm"
        }`}>
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-dashed border-stone-200/60 dark:border-stone-800">
            <div className={`p-2.5 rounded-2xl ${isDarkMode ? "bg-rose-950/60 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className={`text-base sm:text-lg font-bold uppercase tracking-wider font-sans ${isDarkMode ? "text-stone-100" : "text-stone-800"}`}>
                Góc Buôn Chuyện & Vạch Trần Tật Xấu 🤫💖
              </h2>
              <p className="text-xs text-stone-400 font-sans mt-0.5">Nơi khui tất tần tật thói hư tật xấu thầm kín và chia sẻ lưu bút ngọt ngào dành cho các bé yêu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 1. NƠI LEAK THÓI QUEN XẤU MẤY ÈM */}
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 transition-all duration-300 ${
              isDarkMode 
                ? "bg-stone-950/60 border-stone-800/80" 
                : "bg-[#fcfaf7] border-[#f2e3e3]"
            }`}>
              <div className={`font-bold text-xs uppercase tracking-wider flex items-center justify-between ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                <span className="flex items-center gap-1.5">
                  <span>Bốc Phốt Các Ẻm Tại Đây</span>
                </span>
                <span id="leakCount" className="text-stone-400 font-mono font-normal text-[11px]">({secretComments.length} bài leak)</span>
              </div>

              <div id="leakList" className="max-h-56 overflow-y-auto space-y-2 border-t border-b border-dashed border-stone-200/40 dark:border-stone-800/60 py-3 text-xs scrollbar-thin">
                {secretComments.length === 0 ? (
                  <p className="text-stone-400 italic text-center py-4">Chưa có thói quen xấu nào bị leak...</p>
                ) : (
                  secretComments.map((item) => {
                    const targetChar = characters.find(c => c.id === item.secretId);
                    return (
                      <div key={item.id} className={`p-3 rounded-xl border text-xs relative ${
                        isDarkMode ? "bg-stone-900/80 border-stone-800 text-stone-200" : "bg-white border-[#f0f0f0] text-stone-800 shadow-2xs"
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className={`font-bold ${currentPastel.primaryText}`}>{item.author}</span>
                            <span className="text-[10px] text-stone-400 font-mono ml-1.5">đã leak về <b>{targetChar ? targetChar.name : "Nhân vật khác"}</b>:</span>
                          </div>
                          <button
                            onClick={() => handleDeleteSecretComment(item.id)}
                            className="text-stone-400 hover:text-rose-500 transition-colors p-1 rounded cursor-pointer"
                            title="Xóa leak"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed">{item.content}</p>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <select
                    id="leakChar"
                    value={leakChar}
                    onChange={(e) => setLeakChar(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors ${
                      isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-[#f2e3e3] text-stone-800"
                    }`}
                  >
                    {characters.map(c => (
                      <option key={c.id} value={c.id}>Bot: {c.name}</option>
                    ))}
                    <option value="khac">Bot / Nhân vật khác</option>
                  </select>

                  <input
                    type="text"
                    id="leakName"
                    placeholder="Biệt danh của nàng... (mặc định: Bé Thỏ Ẩn Danh 🐰🌸)"
                    value={leakName}
                    onChange={(e) => setLeakName(e.target.value)}
                    className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors ${
                      isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-[#f2e3e3] text-stone-800"
                    }`}
                  />
                </div>

                <textarea
                  id="leakContent"
                  rows={2}
                  placeholder="Nhập thói hư tật xấu thầm kín nàng muốn khui ở đây nha... 🤫📝"
                  value={leakContent}
                  onChange={(e) => setLeakContent(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-xs outline-none resize-none transition-colors ${
                    isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-[#f2e3e3] text-stone-800"
                  }`}
                />

                <div className="flex justify-end">
                  <button
                    onClick={addLeak}
                    className={`${currentPastel.primaryBtnBg} font-bold text-xs py-2 px-5 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95`}
                  >
                    BẮT ĐẦU PHỚT 🤫✈
                  </button>
                </div>
              </div>
            </div>

            {/* 2. NHẬN XÉT BOT NHÀ MEOMEO */}
            <div className={`p-5 rounded-2xl border flex flex-col gap-4 transition-all duration-300 ${
              isDarkMode 
                ? "bg-stone-950/60 border-stone-800/80" 
                : "bg-[#fcfaf7] border-[#f2e3e3]"
            }`}>
              <div className={`font-bold text-xs uppercase tracking-wider flex items-center justify-between ${isDarkMode ? "text-stone-200" : "text-stone-800"}`}>
                <span className="flex items-center gap-1.5">
                  <span>💬 LƯU BÚT NGỌT NGÀO GỬI MEO MEO 💌🌸</span>
                </span>
                <span id="botFeedbacksCount" className="text-stone-400 font-mono font-normal text-[11px]">({botFeedbacks.length} lời nhắn)</span>
              </div>

              <div id="botFeedbacksList" className="max-h-56 overflow-y-auto space-y-2 border-t border-b border-dashed border-stone-200/40 dark:border-stone-800/60 py-3 text-xs scrollbar-thin">
                {botFeedbacks.length === 0 ? (
                  <p className="text-stone-400 italic text-center py-4">Chưa có lời nhắn nào gửi về nhà...</p>
                ) : (
                  botFeedbacks.map((fb) => (
                    <div key={fb.id} className={`p-3 rounded-xl border text-xs relative ${
                      isDarkMode ? "bg-stone-900/80 border-stone-800 text-stone-200" : "bg-white border-[#f0f0f0] text-stone-800 shadow-2xs"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className={`font-bold ${currentPastel.primaryText}`}>{fb.author || fb.name || "Ẩn danh"}</span>
                          {fb.timestamp && <span className="text-[10px] text-stone-400 font-mono ml-2">({fb.timestamp})</span>}
                        </div>
                        <button
                          onClick={() => handleDeleteBotFeedback(fb.id)}
                          className="text-stone-400 hover:text-rose-500 transition-colors p-1 rounded cursor-pointer"
                          title="Xóa lời nhắn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{fb.content}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2.5 pt-1">
                <input
                  type="text"
                  placeholder="Biệt danh ngọt ngào của nàng... (mặc định: Em Bé Giấu Tên 🌸)"
                  value={fbName}
                  onChange={(e) => setFbName(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-xs outline-none transition-colors ${
                    isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-[#f2e3e3] text-stone-800"
                  }`}
                />

                <textarea
                  rows={2}
                  placeholder="Hãy gửi những lời nhắn nhủ, yêu thương hoặc góp ý siêu đáng yêu của nàng dành cho Meo Meo nhé... ✨🍼"
                  value={fbContent}
                  onChange={(e) => setFbContent(e.target.value)}
                  className={`w-full border rounded-xl p-2.5 text-xs outline-none resize-none transition-colors ${
                    isDarkMode ? "bg-stone-900 border-stone-800 text-stone-200" : "bg-white border-[#f2e3e3] text-stone-800"
                  }`}
                />

                <div className="flex justify-end">
                  <button
                    onClick={addFeedback}
                    className={`${currentPastel.primaryBtnBg} font-bold text-xs py-2 px-5 rounded-full cursor-pointer transition-all flex items-center gap-1.5 shadow-sm active:scale-95`}
                  >
                    GỬI YÊU THƯƠNG ✨
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
          </>
        )}
      </main>

      {/* Detailed Profile Modal */}
      <AnimatePresence>
        {selectedCharacter && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className={`w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border transition-colors duration-300 ${
                isDarkMode 
                  ? "bg-stone-950 border-stone-800 text-white" 
                  : `${currentPastel.pageBgLight} ${currentPastel.primaryBorderLight} text-stone-800`
              }`}
              id="character-modal"
            >
              {/* Modal Header */}
              <div className={`p-6 border-b flex justify-between items-center transition-colors duration-300 ${
                isDarkMode 
                  ? "border-stone-900 bg-stone-900/90" 
                  : `${currentPastel.primaryBorderLight} bg-gradient-to-r ${currentPastel.accentGradient}/15 ${currentPastel.primaryBgLight}`
              }`}>
                <div className="flex items-center space-x-3">
                  <span className={`text-3xl select-none w-10 h-10 rounded-full aspect-square flex items-center justify-center overflow-hidden shrink-0 shadow-inner border transition-colors ${
                    isDarkMode ? "bg-stone-900 border-stone-800" : `bg-white ${currentPastel.primaryBorderLight}`
                  }`}>
                    {isImageUrl(selectedCharacter.avatar) ? (
                      <img 
                        src={formatImageUrl(selectedCharacter.avatar)} 
                        alt={selectedCharacter.name} 
                        className="w-full h-full object-cover aspect-square rounded-full shrink-0" 
                        referrerPolicy="no-referrer"
                        onError={(e) => handleImageError(e, selectedCharacter.name)}
                      />
                    ) : (
                      selectedCharacter.avatar
                    )}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className={`text-xl font-serif italic leading-tight font-bold transition-colors ${
                        isDarkMode ? "text-white" : "text-stone-800"
                      }`}>
                        {isEditMode ? "Hiệu chỉnh nhân vật" : selectedCharacter.name}
                      </h2>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden sm:inline-flex items-center gap-1 ${currentPastel.badgeBg} ${currentPastel.badgeText}`}>
                        {currentPastel.icon} {currentPastel.name}
                      </span>
                    </div>
                    {!isEditMode && (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                          isDarkMode ? "text-stone-400" : "text-stone-500"
                        }`}>
                          <Eye className="w-3.5 h-3.5 text-rose-400" />
                          <span>{selectedCharacter.views || 0} lượt xem</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isEditMode && (
                    <button
                      onClick={() => handleToggleFavorite(selectedCharacter.id)}
                      className={`p-1.5 rounded-full transition-all cursor-pointer border ${
                        selectedCharacter.isFavorite
                          ? isDarkMode 
                            ? `${currentPastel.primaryBgDark} ${currentPastel.primaryText} ${currentPastel.primaryBorderDark}`
                            : `${currentPastel.primaryBgLight} ${currentPastel.primaryText} ${currentPastel.primaryBorderLight}`
                          : isDarkMode
                            ? "bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border-stone-800"
                            : `bg-white hover:${currentPastel.primaryBgLight} text-stone-400 hover:${currentPastel.primaryText} border border-stone-200`
                      }`}
                      title={selectedCharacter.isFavorite ? "Bỏ yêu thích" : "Yêu thích ❤️"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${selectedCharacter.isFavorite ? `${currentPastel.primaryText} fill-current` : ""}`} />
                    </button>
                  )}
                  {/* Category badge removed */}
                  <button
                    onClick={() => {
                      setSelectedCharacter(null);
                      setIsEditMode(false);
                    }}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      isDarkMode ? "hover:bg-stone-800 text-stone-400 hover:text-stone-200" : "hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body / Scrollable Content */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6" id="modal-scroll-container">
                <AnimatePresence mode="wait">
                  {(selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "pending" ? (
                    <motion.div
                      key="age-verification"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-pulse shadow-md">
                        <span className="text-3xl font-extrabold text-rose-500 font-mono">18+</span>
                      </div>
                      <div className="space-y-3 max-w-md">
                        <h3 className="text-lg font-serif font-bold text-stone-800 dark:text-stone-100">
                          Cảnh báo nội dung nhạy cảm! 🔞
                        </h3>
                        <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                          Đây là nhân vật 18+. Nàng iu chắc chắn là mình đủ hoặc trên 18 rồi chứ?
                        </p>
                        <p className="text-xs text-rose-500/90 dark:text-rose-400/90 leading-relaxed font-sans font-semibold italic bg-rose-500/5 dark:bg-rose-500/10 p-3 rounded-xl border border-rose-500/10 dark:border-rose-500/20 text-justify">
                          ⚠️ Hãy chắc chắn nàng iu đã đủ tuổi vì tui sẽ không chịu bất kì trách nhiệm nào nếu nàng iu vẫn cố chấp ạ, hãy thông cảm cho Meo
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-2">
                        <button
                          type="button"
                          onClick={() => setAgeVerification("rejected")}
                          className="flex-1 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full font-bold font-sans text-xs transition-all cursor-pointer border border-stone-300 dark:border-stone-800 shadow-xs"
                        >
                          Nô, tui còn trẻ lắm chưa chơi được
                        </button>
                        <button
                          type="button"
                          onClick={() => setAgeVerification("verified")}
                          className={`flex-1 px-4 py-2.5 rounded-full font-bold font-sans text-xs transition-all cursor-pointer shadow-md ${
                            isDarkMode
                              ? "bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700"
                              : "bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-stone-900"
                          }`}
                        >
                          Yé, tui đã đủ tuổi hãy để tui chơi
                        </button>
                      </div>
                    </motion.div>
                  ) : isEditMode ? (
                    /* EDIT MODE PANEL */
                    <motion.form 
                      key="edit-panel"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onSubmit={handleUpdateCharacter}
                      className="space-y-4"
                    >
                      {/* Name and Role inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1">TÊN NHÂN VẬT *</label>
                          <input
                            type="text"
                            required
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className={`w-full px-3 py-2 bg-white border ${currentPastel.primaryBorderLight} text-xs text-stone-800 ${currentPastel.focusRing} transition-all font-sans rounded-xl`}
                          />
                        </div>
                      </div>

                      {/* Link input */}
                      <div>
                        <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1">ĐƯỜNG DẪN LIÊN KẾT NHÂN VẬT *</label>
                        <input
                          type="text"
                          required
                          value={editLink}
                          onChange={(e) => setEditLink(e.target.value)}
                          className={`w-full px-3 py-2 bg-white border ${currentPastel.primaryBorderLight} text-xs text-stone-800 ${currentPastel.focusRing} transition-all font-sans rounded-xl`}
                        />
                      </div>

                      {/* Plot input */}
                      <div>
                        <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1">THỂ LOẠI / TAGS (GENRE / TAGS)</label>
                        <textarea
                          rows={3}
                          value={editPlot}
                          onChange={(e) => setEditPlot(e.target.value)}
                          className={`w-full px-3 py-2 bg-white border ${currentPastel.primaryBorderLight} text-xs text-stone-800 ${currentPastel.focusRing} transition-all font-sans resize-none rounded-xl`}
                          placeholder="Ví dụ: Ngọt ngào, Tổng tài, Chiều chuộng, Ngược luyến... (Dùng dấu phẩy để phân tách)"
                        />
                      </div>

                      {/* Storyline input */}
                      <div>
                        <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1">CỐT TRUYỆN CHI TIẾT (STORYLINE)</label>
                        <textarea
                          rows={10}
                          value={editStoryline}
                          onChange={(e) => setEditStoryline(e.target.value)}
                          className={`w-full px-3 py-2 bg-white border ${currentPastel.primaryBorderLight} text-xs text-stone-800 ${currentPastel.focusRing} transition-all font-sans resize-none rounded-xl`}
                          placeholder="Kể chi tiết về bối cảnh, cuộc đời, biến cố của nhân vật..."
                        />
                      </div>

                      {/* Avatar and Theme Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1">AVATAR (EMOJI / LINK ẢNH)</label>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border shrink-0 overflow-hidden flex items-center justify-center bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 shadow-inner">
                              {isImageUrl(editAvatar) ? (
                                <img src={formatImageUrl(editAvatar)} alt="Avatar Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={(e) => handleImageError(e, editName || "Avatar")} />
                              ) : (
                                <span className="text-base select-none">{editAvatar || "👤"}</span>
                              )}
                            </div>
                            <input
                              type="text"
                              value={editAvatar}
                              onChange={(e) => setEditAvatar(e.target.value)}
                              placeholder="Ví dụ: 🐱 hoặc link ảnh..."
                              className={`w-full px-3 py-1.5 bg-white border ${currentPastel.primaryBorderLight} text-xs text-stone-800 ${currentPastel.focusRing} transition-all font-sans rounded-xl`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1">CHỦ ĐỀ MÀU</label>
                          <select
                            value={editThemeColor}
                            onChange={(e) => setEditThemeColor(e.target.value)}
                            className={`w-full px-3 py-1.5 bg-white border ${currentPastel.primaryBorderLight} text-xs text-stone-800 ${currentPastel.focusRing} transition-all font-sans rounded-xl`}
                          >
                            {PRESET_THEMES.map(theme => (
                              <option key={theme.value} value={theme.value}>{theme.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Action buttons inside Edit Panel */}
                      <div className="flex justify-end space-x-3 pt-4 border-t border-[#eadbca]/30 mt-6">
                        <button
                          type="button"
                          onClick={() => setIsEditMode(false)}
                          className="px-4 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-500 font-sans text-xs font-semibold rounded-full cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                        <button
                          type="submit"
                          className={`px-5 py-2 ${currentPastel.primaryBtnBg} font-sans text-xs font-bold uppercase rounded-full cursor-pointer shadow-xs`}
                        >
                          Cập nhật nhân vật
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    /* PROFILE SHOW PANEL */
                    <motion.div 
                      key="show-panel"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      {/* Character Plot & Story details */}
                      <div className="space-y-5">
                        <div className={`border p-4 rounded-2xl shadow-inner transition-colors duration-300 ${
                          isDarkMode ? "bg-stone-950/40 border-stone-800" : `${currentPastel.primaryBgLight}/60 ${currentPastel.primaryBorderLight}`
                        }`}>
                          <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                            <div className={`flex items-center space-x-2 text-[10px] font-sans font-bold tracking-widest uppercase ${
                              isDarkMode ? "text-stone-400" : "text-stone-500"
                            }`}>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Phân Loại &amp; Tags:</span>
                            </div>
                            {selectedCharacter.category && (
                              <span className={`text-[9px] uppercase tracking-wider border px-3 py-0.5 rounded-full font-mono font-bold ${
                                isDarkMode 
                                  ? "text-amber-400 border-amber-900/60 bg-amber-950/40" 
                                  : "text-amber-800 border-[#eadbca] bg-amber-50"
                              }`}>
                                {selectedCharacter.category}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 transition-all duration-300">
                            {selectedCharacter.tags && selectedCharacter.tags.length > 0 ? (
                              selectedCharacter.tags.map((tag, i) => tag.trim() && (
                                <span 
                                  key={i}
                                  className={`text-[11px] px-2.5 py-1 rounded-full border font-medium select-none shadow-sm tracking-wide transition-all ${
                                    isDarkMode 
                                      ? `${currentPastel.primaryBgDark} ${currentPastel.primaryBorderDark} ${currentPastel.primaryText}` 
                                      : `${currentPastel.primaryBgLight} ${currentPastel.primaryBorderLight} ${currentPastel.primaryText}`
                                  }`}
                                >
                                  {tag.trim()}
                                </span>
                              ))
                            ) : selectedCharacter.plot && (selectedCharacter.plot.includes(',') || selectedCharacter.plot.includes(';')) ? (
                              (selectedCharacter.plot.includes(';') ? selectedCharacter.plot.split(';') : selectedCharacter.plot.split(',')).map((tag, i) => tag.trim() && (
                                <span 
                                  key={i}
                                  className={`text-[11px] px-2.5 py-1 rounded-full border font-medium select-none shadow-sm tracking-wide transition-all ${
                                    isDarkMode 
                                      ? `${currentPastel.primaryBgDark} ${currentPastel.primaryBorderDark} ${currentPastel.primaryText}` 
                                      : `${currentPastel.primaryBgLight} ${currentPastel.primaryBorderLight} ${currentPastel.primaryText}`
                                  }`}
                                >
                                  {tag.trim()}
                                </span>
                              ))
                            ) : (
                              <p className={`text-sm leading-relaxed font-serif italic text-justify transition-colors duration-300 ${
                                isDarkMode ? "text-white" : "text-stone-700"
                              }`}>
                                {selectedCharacter.plot || "Chưa chọn thể loại / tags."}
                              </p>
                            )}
                          </div>
                        </div>

                        {selectedCharacter.note && (
                          <div className={`border p-4 rounded-2xl space-y-2 transition-all duration-300 shadow-xs ${
                            isDarkMode 
                              ? "bg-amber-950/15 border-amber-900/30 text-amber-200" 
                              : "bg-amber-50/50 border-amber-200/50 text-amber-900"
                          }`}>
                            <div className="flex items-center space-x-2 text-[10px] font-sans font-bold tracking-widest uppercase">
                              <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                              <span className="font-bold tracking-wider">Lưu ý quan trọng:</span>
                            </div>
                            <p className="text-xs font-sans leading-relaxed text-justify text-justify-inter-character">
                              {selectedCharacter.note}
                            </p>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                            <div className={`flex items-center space-x-2 text-[10px] font-sans font-bold tracking-widest uppercase ${
                              isDarkMode ? "text-stone-400" : "text-stone-500"
                            }`}>
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>Cốt truyện chi tiết:</span>
                            </div>
                            
                            {/* Font size adjustment buttons */}
                            {!((selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected") && (
                              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-900/80 p-0.5 rounded-lg border border-stone-250/60 dark:border-stone-800">
                                <span className={`text-[9px] font-mono font-semibold px-1.5 text-stone-400 select-none uppercase tracking-wider`}>Cỡ chữ:</span>
                                {([ "sm", "base", "lg", "xl" ] as const).map((size) => {
                                  const labels = { sm: "A-", base: "A", lg: "A+", xl: "A++" };
                                  const titles = { sm: "Cỡ chữ nhỏ", base: "Cỡ chữ vừa", lg: "Cỡ chữ lớn", xl: "Cỡ chữ rất lớn" };
                                  const active = storyFontSize === size;
                                  return (
                                    <button
                                      key={size}
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setStoryFontSize(size);
                                      }}
                                      title={titles[size]}
                                      className={`text-[10px] font-bold w-6 h-6 rounded flex items-center justify-center transition-all cursor-pointer ${
                                        active 
                                          ? isDarkMode
                                            ? "bg-stone-800 text-white shadow-xs" 
                                            : `bg-white shadow-xs border ${currentPastel.primaryBorderLight} ${currentPastel.primaryText}`
                                          : isDarkMode
                                            ? "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                                            : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                                      }`}
                                    >
                                      {labels[size]}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {isStoryExpanded && hasStoryScrollbar && !((selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected") && (
                              <div className={`flex items-center gap-1.5 text-[9px] font-mono font-bold ${currentPastel.primaryText} ${currentPastel.primaryBgLight} dark:${currentPastel.primaryBgDark} px-2 py-0.5 rounded-full border ${currentPastel.primaryBorderLight} dark:${currentPastel.primaryBorderDark} select-none`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${currentPastel.tagActive} animate-pulse`} />
                                <span>Tiến trình: {Math.round(storyScrollProgress)}%</span>
                              </div>
                            )}
                          </div>

                          {/* Top-aligned dynamic reading progress bar */}
                          {isStoryExpanded && hasStoryScrollbar && !((selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected") && (
                            <div className="w-full h-1 bg-stone-200/45 dark:bg-stone-800/40 rounded-full overflow-hidden mb-2.5">
                              <motion.div 
                                className={`h-full bg-gradient-to-r ${currentPastel.accentGradient} rounded-full`}
                                style={{ width: `${storyScrollProgress}%` }}
                                initial={{ width: "0%" }}
                                animate={{ width: `${storyScrollProgress}%` }}
                                transition={{ duration: 0.1 }}
                              />
                            </div>
                          )}

                          {((selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected") ? (
                            <div className="border border-rose-200/40 bg-rose-50/10 dark:bg-rose-950/10 dark:border-rose-900/30 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
                              <Lock className="w-10 h-10 text-rose-500 animate-pulse" />
                              <div className="space-y-1.5 max-w-sm">
                                <p className="text-xs font-bold text-rose-500 tracking-wider uppercase font-sans">Nội dung 18+ đã bị khóa</p>
                                <p className="text-xs text-stone-600 dark:text-stone-400 font-sans leading-relaxed">
                                  Bạn chọn chưa đủ tuổi nên không thể đọc cốt truyện chi tiết hoặc vào đường dẫn liên kết của nhân vật này.
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setAgeVerification("pending")}
                                className={`px-4 py-1.5 rounded-full font-bold font-sans text-[10px] transition-all cursor-pointer shadow-xs ${
                                  isDarkMode 
                                    ? "bg-rose-500 hover:bg-rose-600 text-white" 
                                    : "bg-rose-100 hover:bg-rose-200 text-stone-900 border border-rose-200"
                                }`}
                              >
                                Xác nhận lại tuổi
                              </button>
                            </div>
                          ) : (
                            <div className="relative">
                              <div 
                                id="storyline-text"
                                onScroll={(e) => {
                                  const target = e.currentTarget;
                                  const totalHeight = target.scrollHeight - target.clientHeight;
                                  if (totalHeight > 0) {
                                    const progress = (target.scrollTop / totalHeight) * 100;
                                    setStoryScrollProgress(progress);
                                  }
                                }}
                                onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                                className={`${FONT_SIZE_CLASSES[storyFontSize]} whitespace-pre-line text-justify border p-4 rounded-2xl overflow-y-auto scrollbar-none shadow-inner transition-all duration-300 cursor-pointer relative ${
                                  isStoryExpanded ? "max-h-[420px]" : "max-h-[140px] overflow-hidden"
                                } ${
                                  isDarkMode 
                                    ? "text-white bg-stone-950/40 border-stone-800" 
                                    : `text-stone-700 ${currentPastel.primaryBgLight}/40 ${currentPastel.primaryBorderLight}`
                                }`}
                                style={{ lineHeight: "1.8" }}
                              >
                                {selectedCharacter.storyline.split('\n').map((paragraph, idx) => {
                                  const trimmed = paragraph.trim();
                                  if (trimmed === "") {
                                    return <div key={idx} className="h-3" />;
                                  }
                                  return (
                                    <p key={idx} className="mb-4 last:mb-0">
                                      {paragraph}
                                    </p>
                                  );
                                })}
                                
                                {/* Bottom gradient overlay when collapsed */}
                                {!isStoryExpanded && (
                                  <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t pointer-events-none ${
                                    isDarkMode ? "from-stone-950 to-transparent" : `from-white to-transparent`
                                  }`} />
                                )}
                              </div>

                              {/* Expand/Collapse Trigger Button */}
                              <div className="flex justify-center mt-2.5">
                                <button
                                  type="button"
                                  onClick={() => setIsStoryExpanded(!isStoryExpanded)}
                                  className={`text-[11px] font-bold px-4 py-1.5 rounded-full border transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                                    isDarkMode 
                                      ? "bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-800" 
                                      : `bg-white ${currentPastel.primaryBorderLight} ${currentPastel.primaryText} hover:bg-stone-50`
                                  }`}
                                >
                                  {isStoryExpanded ? (
                                    <>
                                      <span>Thu gọn cốt truyện</span>
                                      <span>▲</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Xem toàn bộ cốt truyện</span>
                                      <span>▼</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                       {/* Link Section */}
                      <div className={`pt-4 border-t space-y-3 transition-colors duration-300 ${
                        isDarkMode ? "border-stone-800" : currentPastel.primaryBorderLight
                      }`}>
                        <div className={`flex items-center space-x-2 text-[10px] font-sans font-bold tracking-widest uppercase ${
                          isDarkMode ? "text-stone-400" : "text-stone-500"
                        }`}>
                          <Link2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Đường dẫn liên kết:</span>
                        </div>
                        {selectedCharacter.id === "kaven-nyx" ? (
                          <div 
                            onClick={() => {
                              playMeowSound();
                              setKavenLockedAlertOpen(true);
                            }}
                            className="border border-[#eadbca]/50 hover:border-rose-400 dark:hover:border-rose-800 bg-rose-50/10 dark:bg-rose-950/10 dark:border-rose-900/20 p-4 rounded-xl flex items-center justify-between shadow-inner cursor-pointer group transition-all hover:scale-[1.01]"
                          >
                            <div className="flex items-center space-x-2">
                              <Lock className="w-4 h-4 text-rose-500 group-hover:animate-bounce shrink-0 transition-colors" />
                              <span className="text-xs text-rose-600 dark:text-rose-400 font-sans font-semibold group-hover:text-rose-500 transition-colors">
                                Nhân vật tạm khóa để sửa chữa
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500 italic">Nhấp để xem ➔</span>
                          </div>
                        ) : ((selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected") ? (
                          <div className="border border-rose-200/40 bg-rose-50/10 dark:bg-rose-950/10 dark:border-rose-900/30 p-4 rounded-xl flex items-center justify-between shadow-inner">
                            <div className="flex items-center space-x-2">
                              <Lock className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                              <span className="text-xs text-stone-600 dark:text-stone-400 font-sans">
                                Đường dẫn liên kết đã bị khóa do giới hạn độ tuổi.
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setAgeVerification("pending")}
                              className={`px-3 py-1 rounded-full font-bold font-sans text-[9px] transition-all cursor-pointer shadow-xs ${
                                isDarkMode 
                                  ? "bg-rose-500 hover:bg-rose-600 text-white" 
                                  : "bg-rose-100 hover:bg-rose-200 text-stone-900 border border-rose-200"
                              }`}
                            >
                              Xác nhận tuổi
                            </button>
                          </div>
                        ) : selectedCharacter.link === "Chưa Có Link" ? (
                          <div 
                            onClick={() => {
                              playMeowSound();
                              setNoLinkAlertOpen(true);
                            }}
                            className="border border-stone-200/40 hover:border-rose-300 dark:hover:border-rose-800 bg-stone-50/10 dark:bg-stone-950/10 dark:border-rose-900/10 p-4 rounded-xl flex items-center justify-between shadow-inner cursor-pointer group transition-all hover:scale-[1.01]"
                          >
                            <div className="flex items-center space-x-2">
                              <Lock className="w-4 h-4 text-stone-500 group-hover:text-rose-500 shrink-0 transition-colors" />
                              <span className="text-xs text-stone-500 dark:text-stone-400 font-sans font-semibold group-hover:text-rose-500 transition-colors">
                                Chưa Có Link
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500 italic">Nhấp để xem ➔</span>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className={`flex-1 text-xs font-mono break-all p-3 border rounded-xl select-all shadow-inner transition-colors duration-300 ${
                              isDarkMode ? "bg-stone-950 border-stone-800 text-stone-300" : `bg-white ${currentPastel.primaryBorderLight} text-stone-600`
                            }`}>
                              {selectedCharacter.link}
                            </div>
                            <a
                              href={selectedCharacter.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-4 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-sm shrink-0 cursor-pointer ${
                                isDarkMode 
                                  ? "bg-rose-500 hover:bg-rose-600 text-white" 
                                  : "bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200"
                              }`}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Đi tới link ➔</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Feedback & Comments Section */}
                      <div className={`pt-6 border-t ${isDarkMode ? "border-stone-800" : currentPastel.primaryBorderLight} space-y-4`}>
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-2 text-[10px] font-sans font-bold tracking-widest uppercase ${
                            isDarkMode ? "text-stone-400" : "text-stone-500"
                          }`}>
                            <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                            <span>Nhận xét bot nhà MeoMeo ({selectedCharacter.feedbacks?.length || 0})</span>
                          </div>
                        </div>

                        {/* Leave a comment form */}
                        <form onSubmit={handleAddFeedback} className={`border p-4 rounded-2xl space-y-3.5 transition-all duration-300 ${
                          isDarkMode ? "bg-stone-950/40 border-stone-800" : `${currentPastel.primaryBgLight}/50 ${currentPastel.primaryBorderLight}`
                        }`}>
                          <div className="text-[10px] font-sans font-bold text-stone-500 uppercase tracking-wider">Feedback bé nhà tại đây</div>

                          <div className="grid grid-cols-1 gap-2.5">
                            <input
                              type="text"
                              placeholder="Tên của bạn (hoặc để trống là Ẩn danh)..."
                              value={feedbackAuthor}
                              onChange={(e) => setFeedbackAuthor(e.target.value)}
                              className={`w-full px-3 py-1.5 text-xs transition-all font-sans rounded-xl focus:outline-none ${
                                isDarkMode 
                                  ? "bg-stone-900 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                                  : `bg-white ${currentPastel.primaryBorderLight} text-stone-800 placeholder-stone-400 ${currentPastel.focusRing}`
                              }`}
                            />
                            <textarea
                              rows={2}
                              required
                              placeholder="Ghi cảm nhận, thỏa thích bình luận về nhân vật này..."
                              value={feedbackContent}
                              onChange={(e) => setFeedbackContent(e.target.value)}
                              className={`w-full px-3 py-1.5 text-xs transition-all font-sans rounded-xl focus:outline-none ${
                                isDarkMode 
                                  ? "bg-stone-900 border-stone-800 text-stone-100 placeholder-stone-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                                  : `bg-white ${currentPastel.primaryBorderLight} text-stone-800 placeholder-stone-400 ${currentPastel.focusRing}`
                              }`}
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setFeedbackStarRating(star)}
                                  className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                  title={`${star} Sao`}
                                >
                                  <Star 
                                    className={`w-4 h-4 ${
                                      star <= feedbackStarRating 
                                        ? "fill-yellow-400 text-yellow-400 drop-shadow-sm" 
                                        : isDarkMode ? "text-stone-700" : "text-stone-300"
                                    }`} 
                                  />
                                </button>
                              ))}
                            </div>
                            <button
                              type="submit"
                              className={`px-4 py-1.5 ${currentPastel.primaryBtnBg} font-sans uppercase text-[9px] tracking-widest font-bold flex items-center space-x-1.5 shadow-sm transition-all rounded-full cursor-pointer`}
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>Gửi cho MeoMeo</span>
                            </button>
                          </div>
                        </form>

                        {/* Existing comments/feedback list */}
                        <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-none">
                          {selectedCharacter.feedbacks && selectedCharacter.feedbacks.length > 0 ? (
                            [...selectedCharacter.feedbacks].reverse().map((fb) => (
                              <div key={fb.id} className={`border p-3 rounded-xl shadow-xs relative group transition-all duration-300 ${
                                isDarkMode 
                                  ? "bg-stone-950/20 border-stone-800 hover:border-stone-700" 
                                  : `bg-white ${currentPastel.primaryBorderLight} hover:shadow-sm`
                              }`}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <div className="flex items-center space-x-2">
                                    <div className={`w-5.5 h-5.5 rounded-full ${currentPastel.primaryBgLight} border ${currentPastel.primaryBorderLight} flex items-center justify-center text-[10px] font-sans font-bold ${currentPastel.primaryText} shrink-0`}>
                                      {fb.author.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className={`text-xs font-sans font-bold transition-colors duration-300 ${
                                        isDarkMode ? "text-white" : "text-stone-700"
                                      }`}>{fb.author}</span>
                                      
                                      {fb.starRating && (
                                        <div className="flex items-center space-x-0.5 mt-0.5">
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <Star 
                                              key={star}
                                              className={`w-2.5 h-2.5 ${
                                                star <= (fb.starRating || 0)
                                                  ? "fill-yellow-400 text-yellow-400"
                                                  : isDarkMode ? "text-stone-700" : "text-stone-200"
                                              }`} 
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-[8px] font-mono text-stone-400">{fb.timestamp}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteFeedback(fb.id)}
                                      className={`p-1 rounded-full transition-colors cursor-pointer ${
                                        isDarkMode ? "text-stone-600 hover:text-red-400 hover:bg-red-950/20" : "text-stone-300 hover:text-red-500 hover:bg-red-50"
                                      }`}
                                      title="Xóa bình luận"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>
                                <p className={`text-xs font-sans leading-relaxed text-left whitespace-pre-wrap transition-colors duration-300 ${
                                  isDarkMode ? "text-white" : "text-stone-600"
                                }`}>{fb.content}</p>
                              </div>
                            ))
                          ) : (
                            <div className={`text-center py-6 border border-dashed rounded-xl text-xs font-sans transition-colors duration-300 ${
                              isDarkMode ? "border-stone-800 text-stone-400" : "border-stone-200 text-stone-400"
                            }`}>
                              Chưa có cảm nhận nào. Hãy là người đầu tiên để lại bình luận nhé! ✨
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Section: Related Characters (Nhân vật cùng thể loại) */}
                      {relatedCharacters.length > 0 && (
                        <div className={`pt-6 border-t transition-colors duration-300 space-y-3.5 ${
                          isDarkMode ? "border-stone-800" : currentPastel.primaryBorderLight
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center space-x-2 text-[10px] font-sans font-bold tracking-widest uppercase ${
                              isDarkMode ? "text-stone-300" : "text-stone-700"
                            }`}>
                              <Sparkles className={`w-3.5 h-3.5 ${currentPastel.primaryText} animate-pulse`} />
                              <span>Nhân vật cùng thể loại:</span>
                            </div>
                            <span className="text-[10px] font-mono text-stone-400">
                              Khám phá thêm ({relatedCharacters.length})
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {relatedCharacters.map((relChar) => {
                              const theme = getThemeDetails(relChar.themeColor);
                              return (
                                <button
                                  key={relChar.id}
                                  type="button"
                                  onClick={() => {
                                    playMeowSound();
                                    setSelectedCharacter(relChar);
                                    const modalScroll = document.getElementById("modal-scroll-container");
                                    if (modalScroll) {
                                      modalScroll.scrollTo({ top: 0, behavior: "smooth" });
                                    }
                                  }}
                                  className={`group relative p-3 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-95 shadow-xs hover:shadow-md ${
                                    isDarkMode 
                                      ? "bg-stone-900/90 hover:bg-stone-800 border-stone-800 text-stone-200" 
                                      : `bg-white hover:${currentPastel.primaryBgLight}/60 border ${currentPastel.primaryBorderLight} text-stone-700`
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden shrink-0 shadow-inner ${theme.bg} ${theme.border}`}>
                                        {isImageUrl(relChar.avatar) ? (
                                          <img 
                                            src={formatImageUrl(relChar.avatar)} 
                                            alt={relChar.name} 
                                            className="w-full h-full object-cover" 
                                            referrerPolicy="no-referrer"
                                            onError={(e) => handleImageError(e, relChar.name)}
                                          />
                                        ) : (
                                          <span className="text-xs">{relChar.avatar}</span>
                                        )}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <h5 className={`text-xs font-bold font-sans truncate group-hover:${currentPastel.primaryText} transition-colors`}>
                                          {relChar.name}
                                        </h5>
                                        <p className="text-[9px] font-mono text-stone-400 truncate">
                                          {relChar.role || "Nhân vật"}
                                        </p>
                                      </div>
                                    </div>

                                    {relChar.plot && (
                                      <div className="flex flex-wrap gap-1 mt-1.5">
                                        {(relChar.plot.includes(';') ? relChar.plot.split(';') : relChar.plot.split(',')).slice(0, 2).map((tag, idx) => tag.trim() && (
                                          <span key={idx} className={`text-[8px] px-1.5 py-0.5 rounded-full font-mono border truncate max-w-[85px] ${
                                            isDarkMode ? `${currentPastel.primaryBgDark} ${currentPastel.primaryText} ${currentPastel.primaryBorderDark}` : `${currentPastel.primaryBgLight} ${currentPastel.primaryText} ${currentPastel.primaryBorderLight}`
                                          }`}>
                                            {tag.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className={`flex flex-col sm:flex-row gap-3 pt-6 border-t ${isDarkMode ? "border-stone-800" : currentPastel.primaryBorderLight}`}>
                        <button
                          onClick={() => {
                            if (selectedCharacter.id === "kaven-nyx") {
                              setKavenLockedAlertOpen(true);
                              return;
                            }
                            setChatCharacterId(selectedCharacter.id);
                            setSelectedCharacter(null);
                            setActiveTab("chat");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`flex-1 py-3 px-4 font-sans uppercase text-[10px] tracking-widest font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer rounded-full shadow-sm ${
                            isDarkMode
                              ? "bg-amber-950/80 border-amber-800 text-amber-300 hover:bg-amber-900"
                              : "bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          <span>💬 Chat Riêng Với Bé</span>
                        </button>

                        <button
                          onClick={() => handleToggleFavorite(selectedCharacter.id)}
                          className={`flex-1 py-3 px-4 font-sans uppercase text-[10px] tracking-widest font-bold flex items-center justify-center space-x-2 border transition-all cursor-pointer rounded-full shadow-sm ${
                            selectedCharacter.isFavorite
                              ? `${currentPastel.primaryBgLight} ${currentPastel.primaryText} ${currentPastel.primaryBorderLight}`
                              : `bg-white hover:${currentPastel.primaryBgLight} text-stone-600 hover:${currentPastel.primaryText} border-stone-200 hover:${currentPastel.primaryBorderLight}`
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${selectedCharacter.isFavorite ? `${currentPastel.primaryText} fill-current animate-pulse` : ""}`} />
                          <span>{selectedCharacter.isFavorite ? "Đã Thích ❤️" : "Thêm Yêu Thích"}</span>
                        </button>

                        {(() => {
                          const isKavenLocked = selectedCharacter.id === "kaven-nyx";
                          const isUnderage = (selectedCharacter.id === "kaiza-tachibana" || selectedCharacter.id === "tham-da") && ageVerification === "rejected";
                          const isNoLink = selectedCharacter.link === "Chưa Có Link" || !selectedCharacter.link || !selectedCharacter.link.startsWith("http");
                          const isDisabled = isUnderage;
                          return (
                            <button
                              onClick={() => {
                                playMeowSound();
                                if (isKavenLocked) {
                                  setKavenLockedAlertOpen(true);
                                } else if (isNoLink) {
                                  setNoLinkAlertOpen(true);
                                } else {
                                  handleGoToLink(selectedCharacter.link);
                                }
                              }}
                              disabled={isDisabled}
                              className={`flex-1 py-3 px-4 font-sans uppercase text-[10px] tracking-widest font-bold flex items-center justify-center space-x-2 shadow-sm transition-all rounded-full cursor-pointer ${
                                isDisabled
                                  ? "bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed border border-stone-300 dark:border-stone-750"
                                  : isKavenLocked
                                    ? "bg-rose-50/50 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 hover:scale-[1.01] active:scale-95"
                                    : isNoLink
                                      ? "bg-rose-50/50 hover:bg-rose-100/50 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 hover:scale-[1.01] active:scale-95"
                                      : `${currentPastel.primaryBtnBg} hover:shadow hover:scale-[1.01] active:scale-95`
                              }`}
                            >
                              <span>
                                {isUnderage 
                                  ? "Đã Khóa (Dưới 18 Tuổi)" 
                                  : isKavenLocked
                                    ? "Đã Khóa Để Sửa Chữa"
                                    : "Nhấp Để Tới Iu Thương Bé"}
                              </span>
                              {isUnderage || isKavenLocked ? (
                                <Lock className="w-4 h-4" />
                              ) : (
                                <ExternalLink className="w-4 h-4" />
                              )}
                            </button>
                          );
                        })()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Create/Add Custom Character */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className={`border w-full max-w-xl rounded-2xl shadow-2xl p-6 md:p-8 transition-colors duration-300 ${
                isDarkMode 
                  ? "bg-stone-900 border-stone-800 text-stone-100" 
                  : "bg-[#ffeef2] border-[#eadbca] text-stone-700"
              }`}
              id="add-character-modal"
            >
              <div className={`flex items-center justify-between mb-6 pb-4 border-b transition-colors duration-300 ${
                isDarkMode ? "border-stone-800" : "border-[#eadbca]/50"
              }`}>
                <div className="flex items-center space-x-2.5">
                  <Plus className="w-4 h-4 text-rose-500" />
                  <h3 className={`text-lg font-serif italic font-bold transition-colors duration-300 ${
                    isDarkMode ? "text-stone-100" : "text-stone-800"
                  }`}>Sáng Tạo Nhân Vật Mới</h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    isDarkMode ? "hover:bg-stone-800 text-stone-500 hover:text-stone-300" : "hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCharacter} className="space-y-4">
                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1.5">Tên nhân vật *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Lục Thần, Satoru Gojo..."
                      value={newCharName}
                      onChange={(e) => setNewCharName(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl text-xs transition-all font-sans focus:outline-none ${
                        isDarkMode 
                          ? "bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                          : "bg-white border-[#eadbca] text-stone-800 placeholder-stone-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Direct Link */}
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1.5">Đường dẫn liên kết nhân vật *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: https://aistudio.google.com/..."
                    value={newCharLink}
                    onChange={(e) => setNewCharLink(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl text-xs transition-all font-sans focus:outline-none ${
                      isDarkMode 
                        ? "bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                        : "bg-white border-[#eadbca] text-stone-800 placeholder-stone-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                    }`}
                  />
                </div>

                {/* Plot Input */}
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1.5">Thể loại / Tags (Genre / Tags)</label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Ngọt ngào, Tổng tài, Đơn phương, Hài hước... (Phân tách bằng dấu phẩy)"
                    value={newCharPlot}
                    onChange={(e) => setNewCharPlot(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl text-xs transition-all font-sans resize-none text-justify focus:outline-none ${
                      isDarkMode 
                        ? "bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                        : "bg-white border-[#eadbca] text-stone-800 placeholder-stone-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                    }`}
                  />
                </div>

                {/* Storyline Input */}
                <div>
                  <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1.5">Cốt truyện chi tiết (Storyline)</label>
                  <textarea
                    rows={8}
                    placeholder="Kể chi tiết về bối cảnh, cuộc đời, câu chuyện của nhân vật..."
                    value={newCharStoryline}
                    onChange={(e) => setNewCharStoryline(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-xl text-xs transition-all font-sans resize-none text-justify focus:outline-none ${
                      isDarkMode 
                        ? "bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                        : "bg-white border-[#eadbca] text-stone-800 placeholder-stone-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                    }`}
                  />
                </div>

                {/* Theme & Avatar Selection Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1.5">Hình đại diện (Emoji / Link)</label>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full border shrink-0 overflow-hidden flex items-center justify-center bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 shadow-inner">
                        {isImageUrl(newCharAvatar) ? (
                          <img src={formatImageUrl(newCharAvatar)} alt="Avatar Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" onError={(e) => handleImageError(e, newCharName || "Avatar")} />
                        ) : (
                          <span className="text-base select-none">{newCharAvatar || "👤"}</span>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Ví dụ: 🐱 hoặc link ảnh..."
                        value={newCharAvatar}
                        onChange={(e) => setNewCharAvatar(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-xl text-xs transition-all font-sans focus:outline-none ${
                          isDarkMode 
                            ? "bg-stone-950 border-stone-800 text-stone-100 placeholder-stone-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                            : "bg-white border-[#eadbca] text-stone-800 placeholder-stone-400 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-stone-500 font-sans uppercase tracking-wider mb-1.5">Tông màu chủ đạo</label>
                    <select
                      value={newCharTheme}
                      onChange={(e) => setNewCharTheme(e.target.value)}
                      className={`w-full px-4 py-2 border rounded-xl text-xs transition-all font-sans focus:outline-none ${
                        isDarkMode 
                          ? "bg-stone-950 border-stone-800 text-stone-100 focus:border-rose-500 focus:ring-1 focus:ring-rose-950" 
                          : "bg-white border-[#eadbca] text-stone-800 focus:border-rose-400 focus:ring-1 focus:ring-rose-200"
                      }`}
                    >
                      {PRESET_THEMES.map((theme) => (
                        <option key={theme.value} value={theme.value} className={isDarkMode ? "bg-stone-900 text-stone-100" : "bg-white text-stone-800"}>
                          {theme.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className={`flex justify-end gap-3 pt-4 border-t mt-4 transition-colors duration-300 ${
                  isDarkMode ? "border-stone-800" : "border-[#eadbca]/30"
                }`}>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className={`px-5 py-2 rounded-full font-sans text-xs font-semibold border transition-all cursor-pointer ${
                      isDarkMode 
                        ? "bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200" 
                        : "bg-white hover:bg-stone-50 border-stone-200 text-stone-500"
                    }`}
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-full ${currentPastel.primaryBtnBg} font-sans text-xs font-bold uppercase transition-all cursor-pointer shadow-xs`}
                    id="submit-character-btn"
                  >
                    Lưu nhân vật
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Donate QR Code Modal */}
      <AnimatePresence>
        {isDonateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDonateModalOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              className={`relative z-10 w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-3xl border shadow-2xl flex flex-col items-center gap-4 text-center transition-colors duration-300 ${
                isDarkMode
                  ? "bg-stone-900/95 border-stone-800 text-stone-100 shadow-rose-950/30"
                  : "bg-white/95 border-[#eadbca] text-stone-800 shadow-rose-100/50"
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsDonateModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-full border transition-all cursor-pointer shadow-xs ${
                  isDarkMode
                    ? "bg-stone-800/80 border-stone-700 text-stone-400 hover:text-white hover:bg-stone-700"
                    : "bg-stone-100/80 border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-200"
                }`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Badge */}
              <div className="flex flex-col items-center gap-1.5 pt-1">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs ${
                  isDarkMode
                    ? "bg-rose-950/70 border-rose-800/80 text-rose-300"
                    : "bg-rose-50 border-rose-200 text-rose-600"
                }`}>
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  Đô na tê ủng hộ tui ở đây
                </span>
                <p className={`text-xs max-w-xs transition-colors duration-300 ${
                  isDarkMode ? "text-stone-400" : "text-stone-500"
                }`}>
                  Cảm ơn sự ủng hộ dịu dàng của bạn dành cho meomeokitty! 🐾💖
                </p>
              </div>

              {/* QR Image Container */}
              <div className="w-full rounded-2xl overflow-hidden border bg-white p-2 shadow-inner">
                <img
                  src={donateQrImg}
                  alt="Đô na tê ủng hộ MoMo / VietQR"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain rounded-xl select-none max-h-[65vh]"
                />
              </div>

              {/* Footer action button */}
              <div className="flex items-center justify-between w-full pt-1 text-[11px]">
                <span className={`font-serif italic transition-colors ${
                  isDarkMode ? "text-stone-400" : "text-stone-500"
                }`}>meomeokitty • a ri ga tô ~</span>
                <button
                  type="button"
                  onClick={() => {
                    playMeowSound();
                    setIsDonateModalOpen(false);
                    showToast("Cảm ơn bạn rất nhiều! meo meo 🐾💖");
                  }}
                  className={`px-4 py-1.5 rounded-full font-bold text-xs border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${
                    isDarkMode
                      ? "bg-rose-950 border-rose-800 text-rose-200 hover:bg-rose-900"
                      : "bg-rose-100 border-rose-200 text-rose-700 hover:bg-rose-200"
                  }`}
                >
                  Gửi trọn yêu thương 💕
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: No Link Alert */}
      <AnimatePresence>
        {noLinkAlertOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNoLinkAlertOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className={`relative z-10 w-full max-w-sm p-6 rounded-3xl border shadow-2xl flex flex-col items-center gap-4 text-center transition-colors duration-300 ${
                isDarkMode
                  ? "bg-stone-900/95 border-stone-800 text-stone-100 shadow-rose-950/30"
                  : "bg-white/95 border-[#eadbca] text-stone-800 shadow-rose-100/50"
              }`}
            >
              {/* Decorative Cute Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-rose-950/40 text-rose-400 border border-rose-900/40" : "bg-rose-50 text-rose-600 border border-rose-100"
              }`}>
                <Lock className="w-5 h-5 animate-bounce" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold">Thông Báo 🐾</h3>
                <p className={`text-sm leading-relaxed font-medium ${
                  isDarkMode ? "text-stone-300" : "text-stone-600"
                }`}>
                  Nhân Vật Này Chưa Có Link, Nàng Yêu Hãy Đợi Nhé
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  playMeowSound();
                  setNoLinkAlertOpen(false);
                }}
                className={`w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer ${
                  isDarkMode
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200"
                }`}
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Kaven Nyx Locked Alert */}
      <AnimatePresence>
        {kavenLockedAlertOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setKavenLockedAlertOpen(false)}
              className="fixed inset-0 bg-black/65 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className={`relative z-10 w-full max-w-sm p-6 rounded-3xl border shadow-2xl flex flex-col items-center gap-4 text-center transition-colors duration-300 ${
                isDarkMode
                  ? "bg-stone-900/95 border-stone-800 text-stone-100 shadow-rose-950/30"
                  : "bg-white/95 border-[#eadbca] text-stone-800 shadow-rose-100/50"
              }`}
            >
              {/* Decorative Cute Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-rose-950/40 text-rose-400 border border-rose-900/40" : "bg-rose-50 text-rose-600 border border-rose-100"
              }`}>
                <Lock className="w-5 h-5 animate-bounce" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold">Thông Báo 🐾</h3>
                <p className={`text-sm leading-relaxed font-semibold ${
                  isDarkMode ? "text-rose-300" : "text-rose-600"
                }`}>
                  Tạm thời khóa để fix Char. Nàng yêu kiếm char khác chơi nhé
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  playMeowSound();
                  setKavenLockedAlertOpen(false);
                }}
                className={`w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer ${
                  isDarkMode
                    ? "bg-rose-500 hover:bg-rose-600 text-white"
                    : "bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-200"
                }`}
              >
                Vâng ạ nhen 💕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Scroll to Top (Lên đầu) Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 z-[90] p-3 rounded-full shadow-lg border cursor-pointer transition-all ${
              isDarkMode 
                ? `bg-stone-900 border-stone-800 ${currentPastel.primaryText} hover:bg-stone-800` 
                : `bg-white border-[#eadbca] ${currentPastel.primaryText} hover:bg-stone-50`
            }`}
            title="Lên đầu trang"
            id="scroll-to-top-btn"
          >
            <ArrowUp className="w-5 h-5 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Floating Light/Dark Mode Toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed bottom-6 left-6 z-[90] p-3 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-110 active:scale-95 ${
          isDarkMode 
            ? "bg-stone-900 border-stone-700 text-amber-400 hover:bg-stone-800 shadow-stone-900/50" 
            : "bg-white border-[#eadbca] text-stone-500 hover:bg-stone-50 hover:text-stone-800 shadow-stone-200/50"
        }`}
        title={isDarkMode ? "Chuyển sang nền sáng ☀️" : "Chuyển sang nền tối 🌙"}
      >
        {isDarkMode ? <Sun className="w-6 h-6 animate-pulse" /> : <Moon className="w-6 h-6 animate-pulse" />}
      </button>

      {/* Floating Font Picker */}
      <div className="fixed bottom-6 left-20 z-[90] flex items-end">
        <AnimatePresence>
          {showFontMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className={`absolute bottom-full left-0 mb-3 p-2 rounded-2xl shadow-xl border w-40 flex flex-col gap-1 ${
                isDarkMode ? "bg-stone-900 border-stone-700" : "bg-white border-[#eadbca]"
              }`}
            >
              {[
                { id: "quicksand", name: "Mặc định (Tròn)", fontClass: "font-sans" },
                { id: "inter", name: "Thanh lịch (Phẳng)", fontClass: "font-sans" }, // We'll just style them directly with inline styles or generic font-sans since the root variable overrides it. Actually, wait. Let's just use regular classes.
              ].length > 0 && false}
              
              <button
                onClick={() => { setGlobalFont("quicksand"); setShowFontMenu(false); }}
                style={{ fontFamily: '"Quicksand", sans-serif' }}
                className={`px-3 py-2 text-sm text-left rounded-xl transition-colors ${globalFont === "quicksand" ? (isDarkMode ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600") : (isDarkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-50")}`}
              >
                Mặc định
              </button>
              <button
                onClick={() => { setGlobalFont("inter"); setShowFontMenu(false); }}
                style={{ fontFamily: '"Inter", sans-serif' }}
                className={`px-3 py-2 text-sm text-left rounded-xl transition-colors ${globalFont === "inter" ? (isDarkMode ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600") : (isDarkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-50")}`}
              >
                Phẳng (Tiêu chuẩn)
              </button>
              <button
                onClick={() => { setGlobalFont("lora"); setShowFontMenu(false); }}
                style={{ fontFamily: '"Lora", serif' }}
                className={`px-3 py-2 text-sm text-left rounded-xl transition-colors ${globalFont === "lora" ? (isDarkMode ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600") : (isDarkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-50")}`}
              >
                Có chân (Serif)
              </button>
              <button
                onClick={() => { setGlobalFont("caveat"); setShowFontMenu(false); }}
                style={{ fontFamily: '"Caveat", cursive', fontSize: '1.1rem' }}
                className={`px-3 py-2 text-left rounded-xl transition-colors ${globalFont === "caveat" ? (isDarkMode ? "bg-rose-500/20 text-rose-400" : "bg-rose-100 text-rose-600") : (isDarkMode ? "text-stone-300 hover:bg-stone-800" : "text-stone-700 hover:bg-stone-50")}`}
              >
                Viết tay
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setShowFontMenu(!showFontMenu)}
          className={`p-3 rounded-full shadow-lg border cursor-pointer transition-all hover:scale-110 active:scale-95 ${
            isDarkMode 
              ? "bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800 shadow-stone-900/50" 
              : "bg-white border-[#eadbca] text-stone-500 hover:bg-stone-50 hover:text-stone-800 shadow-stone-200/50"
          } ${showFontMenu ? (isDarkMode ? "ring-2 ring-rose-500/50" : "ring-2 ring-rose-400/50") : ""}`}
          title="Thay đổi font chữ"
        >
          <Type className="w-5 h-5" />
        </button>
      </div>

      {/* Centered Pop-Up Highlight Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center p-4">
            {/* Gentle dark glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.2 } }}
              className={`relative pointer-events-auto flex flex-col items-center gap-3 px-8 py-6 border backdrop-blur-xl shadow-2xl font-sans rounded-3xl max-w-sm text-center transition-all duration-300 ${
                isDarkMode 
                  ? "bg-stone-900/95 border-stone-800 text-stone-100 shadow-2xl" 
                  : `bg-white/95 ${currentPastel.primaryBorderLight} text-stone-800 shadow-xl`
              }`}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-rose-500/20 animate-ping" />
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                  isDarkMode 
                    ? `bg-stone-950 border-stone-800 ${currentPastel.primaryText}` 
                    : `${currentPastel.badgeBg} ${currentPastel.primaryText}`
                }`}>
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${currentPastel.primaryText}`}>
                  THÔNG BÁO ✨
                </span>
                <p className="text-sm font-semibold tracking-wide leading-snug px-2">
                  {toastMessage}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* Floating Music Player */}
      <MusicPlayer isDarkMode={isDarkMode} />

    </div>
  );
}
