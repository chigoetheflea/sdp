<?php
	/*version:1.1*/
	function user_browser() {
		$agent=$_SERVER['HTTP_USER_AGENT'];

		preg_match("/(MSIE|Opera|Firefox|Chrome|Version|Opera Mini|Netscape|Konqueror|SeaMonkey|Camino|Minefield|Iceweasel|K-Meleon|Maxthon|YaBrowser|Trident)(?:\/| )([0-9.]+)/", $agent, $info); // регулярное выражение, которое позволяет отпределить 90% браузеров
		list(,$browser,$version) = $info; // получаем данные из массива в переменную
		
		$browser_info=array('browser' => $browser, 'version' => $version);
		
		if (preg_match("/Opera ([0-9.]+)/i", $agent, $opera)) $browser_info=array(browser=>'opera',version=>$opera[1]); //определение _очень_старых_ версий Оперы (до 8.50), при желании можно убрать
		
		if ((preg_match("/([0-9.]+) YaBrowser/i", $agent, $yab))) $browser_info=array(browser=>'YaBrowser',version=>$yab[1]);
		
		if ((preg_match("/Trident ([0-9.]+)/i", $agent, $ie11))) $browser_info=array(browser=>'MSIE11',version=>$ie11[1]);
		
		if ($browser == 'MSIE') { // если браузер определён как IE
				preg_match("/(Maxthon|Avant Browser|MyIE2)/i", $agent, $ie); // проверяем, не разработка ли это на основе IE
				if ($ie) $browser_info=array(browser=>$ie[1],version=>'based on IE'); // если да, то возвращаем сообщение об этом
				else $browser_info=array(browser=>'ie',version=>$version); // иначе просто возвращаем IE и номер версии
		}
		
		if ($browser == 'Firefox') { // если браузер определён как Firefox
				preg_match("/(Flock|Navigator|Epiphany)\/([0-9.]+)/", $agent, $ff); // проверяем, не разработка ли это на основе Firefox
				if ($ff) $browser_info=array(browser=>$ff[1],version=>$ff[2]); // если да, то выводим номер и версию
		}
		
		if ($browser == 'Opera' && $version == '9.80') $browser_info=array(browser=>'opera',version=>substr($agent,-5)); // если браузер определён как Opera 9.80, берём версию Оперы из конца строки
		
		if ($browser == 'Version') $browser_info=array(browser=>'safari',version=>$version); // определяем Сафари
		
		if (!$browser && strpos($agent, 'Gecko')) $browser_info=array(browser=>'Browser-based-on-Gecko',version=>'unnown'); // для неопознанных браузеров проверяем, если они на движке Gecko, и возращаем сообщение об этом
		
		$browser_info["browser"]=strtolower($browser_info["browser"]);
		
		$version=explode(".",$browser_info["version"]);
		
		$browser_info["version"]=$version[0];
		
		return $browser_info;
	}
?>