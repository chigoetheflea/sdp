<?php

	header( "Access-Control-Allow-Origin: *" );

	function phpmail(){

		require_once( "class.phpmailer.php" );
		require_once( "class.smtp.php" );
		require_once( "mail_template.php" );

		/* Данные получателя */

		$recipient_name = "ПСИИН";
		$recipient_email = "help@psy-in.ru";
    $recipient_copy_email_1 = "admin@psy-in.ru";
    $recipient_copy_email_2 = "cons@psy-in.ru";

		/* Данные получателя */

		$ERROR = false;
		$send_to_client = false;

		if( isset( $_POST[ "message_type" ] ) && !empty( $_POST[ "message_type" ] ) ) $msgtype = $_POST[ "message_type" ]; else $ERROR = true;

		$error_message = "<span class='mail-info  form_result-error' data-error='true'>Ошибка!<br>Попробуйте еще раз!</span>";
		$success_message = "<span class='mail-info  form_result-success'>Отправлено!</span>";

		switch( $msgtype ) {

			case "request":

				if( isset( $_POST[ "request_name" ] ) && !empty( $_POST[ "request_name" ] ) )		$sender_name = $_POST[ "request_name" ]; else $ERROR = true;
				if( isset( $_POST[ "request_phone" ] ) && !empty( $_POST[ "request_phone" ] ) )		$sender_phone = $_POST[ "request_phone" ]; else $ERROR = true;
				if( isset( $_POST[ "request_email" ] ) && !empty( $_POST[ "request_email" ] ) )		$sender_email = $_POST[ "request_email" ]; else $ERROR = true;
				if( isset( $_POST[ "request_message" ] ) && !empty( $_POST[ "request_message" ] ) )	$sender_message = $_POST[ "request_message" ]; else $ERROR = true;

				$send_to_client = true;
				$theme_mail_owner = "Новая заявка на консультацию";
				$theme_mail_client = "Вы подали заявку на консультацию";
				$body_mail_client = "<p>Здравствуйте, "
					. $sender_name
					. ".</p><p>Вы обратились к нам за консультацией. Наши специалисты свяжутся с Вами для подтверждения заявки.</p>";

				break;

		}

		if( !$ERROR ) {

			/* Настройки отправки */

			$__smtp = array(
				"host" => "smtp.yandex.ru", // SMTP сервер
				"debug" => 0, // Уровень логирования
				"auth" => true, // Авторизация на сервере SMTP. Если ее нет - false
				"port" => "465", // Порт SMTP сервера
				"username" => "no-reply@psy-in.ru", // Логин запрашиваемый при авторизации на SMTP сервере
				"password" => "1qaz3edc", // Пароль
				"addreply" => $recipient_email, // Почта для ответа
				"secure" => "ssl", // Тип шифрования. Например ssl или tls
				"mail_name" => $recipient_name // Имя отправителя
			);

			/* Настройки отправки */

			/* Письмо организатору */

			$mail = new PHPMailer( true ); // Создаем экземпляр класса PHPMailer
			$mail -> IsSMTP(); // Указываем режим работы с SMTP сервером
			$mail -> Host       = $__smtp[ 'host' ];  // Host SMTP сервера: ip или доменное имя
			$mail -> SMTPDebug  = $__smtp[ 'debug' ];  // Уровень журнализации работы SMTP клиента PHPMailer
			$mail -> SMTPAuth   = $__smtp[ 'auth' ];  // Наличие авторизации на SMTP сервере
			$mail -> Port       = $__smtp[ 'port' ];  // Порт SMTP сервера
			$mail -> SMTPSecure = $__smtp[ 'secure' ];  // Тип шифрования. Например ssl или tls
			$mail -> CharSet = "UTF-8";  // Кодировка обмена сообщениями с SMTP сервером
			$mail -> Username   = $__smtp[ 'username' ];  // Имя пользователя на SMTP сервере
			$mail -> Password   = $__smtp[ 'password' ];  // Пароль от учетной записи на SMTP сервере
			$mail -> AddAddress( $recipient_email, $recipient_name );  // Адресат почтового сообщения
      $mail -> AddReplyTo( $__smtp[ 'addreply' ], $recipient_name );  // Альтернативный адрес для ответа
      $mail -> AddCC( $recipient_copy_email_1, "ПСИИН" );
      $mail -> AddCC( $recipient_copy_email_2, "ПСИИН" );
			$mail -> SetFrom( $__smtp[ 'username'], $theme_mail_owner );  // Адресант почтового сообщения
			$mail -> Subject = htmlspecialchars( $theme_mail_owner );  // Тема письма

			$message_to_owner = $mail_header
								. $mail_header_tag . $theme_mail_owner . $mail_header_tag_end
								. $mail_paragraph
								. "<strong>Информация о заявителе:</strong><br><br>"
								. "Имя: " . $sender_name . "<br>";

			if( isset( $sender_email ) ) 	$message_to_owner .= "E-mail: " . $sender_email . "<br>";
			if( isset( $sender_phone ) ) 	$message_to_owner .= "Телефон: " . $sender_phone . "<br>";
			if( isset( $sender_message ) ) 	$message_to_owner .= "Сообщение: " . $sender_message . "<br>";

			$message_to_owner .= $mail_paragraph_end . $mail_footer;

			$mail -> MsgHTML( $message_to_owner );

			/* Письмо организатору */

			if( $send_to_client ) {

				/* Письмо заявителю */

				$message_to_client = $mail_header . $mail_header_tag . $theme_mail_client . $mail_header_tag_end . $mail_paragraph . $body_mail_client . $mail_paragraph_end . $mail_footer;

				$mail_to_client = new PHPMailer( true ); // Создаем экземпляр класса PHPMailer
				$mail_to_client -> IsSMTP(); // Указываем режим работы с SMTP сервером
				$mail_to_client -> Host       = $__smtp[ 'host' ];  // Host SMTP сервера: ip или доменное имя
				$mail_to_client -> SMTPDebug  = $__smtp[ 'debug' ];  // Уровень журнализации работы SMTP клиента PHPMailer
				$mail_to_client -> SMTPAuth   = $__smtp[ 'auth' ];  // Наличие авторизации на SMTP сервере
				$mail_to_client -> Port       = $__smtp[ 'port' ];  // Порт SMTP сервера
				$mail_to_client -> SMTPSecure = $__smtp[ 'secure' ];  // Тип шифрования. Например ssl или tls
				$mail_to_client -> CharSet = "UTF-8";  // Кодировка обмена сообщениями с SMTP сервером
				$mail_to_client -> Username   = $__smtp[ 'username' ];  // Имя пользователя на SMTP сервере
				$mail_to_client -> Password   = $__smtp[ 'password' ];  // Пароль от учетной записи на SMTP сервере
				$mail_to_client -> AddAddress( $sender_email, $sender_name );  // Адресат почтового сообщения
				$mail_to_client -> AddReplyTo($__smtp[ 'addreply' ], $recipient_name );  // Альтернативный адрес для ответа
				$mail_to_client -> SetFrom($__smtp[ 'username' ], $theme_mail_client );  // Адресант почтового сообщения
				$mail_to_client -> Subject = htmlspecialchars( $theme_mail_client );  // Тема письма
				$mail_to_client -> MsgHTML( $message_to_client ); // Текст сообщения

				/* Письмо заявителю */

				/* Отправка 2х писем */

				if( $mail -> Send() && $mail_to_client -> Send() ) echo( $success_message );
				else die( $error_message );

				/* Отправка 2х писем */

			} else {

				/* Отправка только организатору */

				if( $mail -> Send() ) echo( $success_message );
				else die( $error_message . " (" . $er . ")" );

				/* Отправка только организатору */

			}

		}	else die( $error_message . " (" . $er . ")" );

	}

	phpmail();

?>
