$(function(){
	
	var url = "https://aleffelixf.000webhostapp.com/sys/fetchphone.php";
	var event_type = "";
	var x = document.getElementById("coords");
	var acoes = false;
	var logado = false;
	var conn = false;
	
	$(".loader").fadeIn();
	
	setTimeout(function(){
		$(".loader").slideUp();
		$(".login").show();
	}, 5000);
	
	setInterval(function(){
		var user = localStorage.getItem("id_user");
		if(user != null && logado == true){
			$.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: {
					tipo: 'verify_events',
					id_user: localStorage.getItem("id_user"),
					telefone: localStorage.getItem("telefone"),
					carregados: localStorage.getItem("carregados")
				}, success: function(retorno){
					if(retorno.status == "ok"){
						initialize(retorno.results, retorno.results.length);
						localStorage.setItem("carregados", retorno.carregados);
						$(".menu").slideUp();
						$(".newevent").show();
					}
				}, error: function(e){
					console.log(e);
				}
			});
		}
	}, 3000);
	
	$(".cadastrar").click(function(){
		$(".login").slideUp();
		$("body").css("background", "#ffff00");
		$(".register").show();
	});
	
	$(".backlogin").click(function(){
		$(".register").slideUp();
		$("body").css("background", "#ffff00");
		$(".login").show();
	});
	
	$("#backcamera").click(function(){
		$(".camera").slideUp();
		$("body").css("background", "#fff");
		$(".menu").show();
	});
	
	$("#backmap").click(function(){
		$("body").css("background", "#ccc");
		$(".newevent").slideUp();
		$(".menu").show();
	});
	
	$("#login").submit(function(){
		if(conn == false){
			conn = true;
			var cpf = $("#cpf_l").val();
			var senha = $("#password_l").val();
			
			if(cpf == "" || senha == ""){
				alert("Você deve informar CPF e Senha");
				return false;
			}
			
			$.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: {
					tipo: 'login',
					cpf: cpf,
					senha: senha
				}, success: function(retorno){
					if(retorno.status == 'ok'){
						logado = true;
						localStorage.setItem("id_user", retorno.user_id);
						localStorage.setItem("telefone", retorno.telefone);
						localStorage.setItem("carregados", retorno.carregados);
						$("body").css("background", "#fff");
						$(".login").slideUp();
						$(".menu").show();
						conn = false;
					}else{
						alert('CPF ou Senha Incorretos');
					}
				}, error: function(e){
					console.log(e);
				}
			});
		}
	});
	
	$("#register").submit(function(){
		if(conn == false){
			conn = true;
			var nome = $("#nome_r").val();
			var rua = $("#rua_r").val();
			var cep = $("#cep_r").val();
			var bairro = $("#bairro_r").val();
			var telefone = $("#telefone_r").val();
			var cpf = $("#cpf_r").val();
			var senha = $("#password_r").val();
			var confsenha = $("#confpass_r").val();
			
			if(nome == "" || rua == "" || cep == "" || bairro == "" || telefone == "" || cpf == ""  || senha == "" || confsenha == ""){
				alert("Você deve preencher todos os campos");
				return false;
			}
			if(senha != confsenha){
				alert("As senhas devem estar iguais");
				return false;
			}
			
			$.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: {
					tipo: 'register',
					nome: nome,
					rua: rua,
					cep: cep,
					bairro: bairro,
					telefone: telefone,
					cpf: cpf,
					senha: senha
				},
				success: function(retorno){
					if(retorno.status == 'ok'){
						localStorage.setItem("id_user", retorno.id_user);
						alert("Cadastro efetuado com sucesso");
						$(".register").slideUp();
						$(".contacts").show();
						conn = false;
					}else{
						alert("Ocorreu um erro, tente novamente mais tarde");
					}
				}
			});
		}
	});
	
	$("#contacts").submit(function(e){
		if(conn == false){
			conn = true;
			e.preventDefault();
			var type = "familiar";
			var contatos = "";
			var created = false;
			var n = 1;
			
			for(var i = 1; i <= 5; i++){
				if(i == 6 && type == 'familiar'){
					type = "vizinho";
					i = 1;
				}else{
					if($("input[name="+type+i+"]").val() != ""){
						contatos += ""+type+","+$("input[name="+type+i+"]").val()+";";
					}
				}
			}
			
			if($("#preferencial").val() == ""){
				alert("Você deve informar o contato preferencial");
				return false;
			}
			
			contatos += "preferencial,"+$("#preferencial").val()+"";
			
			
			$.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: {
					tipo: 'contacts',
					id_user: localStorage.getItem("id_user"),
					contacts: contatos
				}, success: function(retorno){
					if(retorno == 'ok'){
						alert('Contatos cadastrados com sucesso');
						$(".contacts").slideUp();
						$(".login").show();
						conn = false;
					}else{
						alert('Ocorreu um erro tente novamente mais tarde');
					}
				}, error: function(e){
					console.log(e);
				}
			});
			
			return false;
		}
	});
	
	$(".item").click(function(){
		event_type = $(this).attr('id');
		
		if(event_type == "prafrente"){
			if(acoes == false){
				$(".acoes").fadeIn();
				acoes = true;
			}else{
				$(".acoes").fadeOut();
				acoes = false;
			}
			return false;
		}
		
		if(event_type == "foto"){
			$(".menu").slideUp();
			$(".camera").show();
			return false;
		}
		
		navigator.geolocation.getCurrentPosition(onSuccess, onError)
		
		var lat = $("#lat").val();
		var lon = $("#lon").val();
		
		$.ajax({
			method: 'POST',
			url: url,
			dataType: 'json',
			data: {
				tipo: 'insert_event',
				id_user: localStorage.getItem("id_user"),
				event_type: event_type,
				lat: lat,
				lon: lon
			}, success: function(retorno){
				if(retorno.status == 'ok'){
					$(".menu").slideUp();
					$(".emergency").show();
					$(".acoes").fadeOut();
					localStorage.setItem("id_evento", retorno.retorno_id);
					acoes = false;
					conn = false;
				}else{
					alert('Ocorreu um erro tente novamente mais tarde');
				}
			}, error: function(e){
				alert('Ocorreu um erro de conexão, tente novamente mais tarde');
				console.log(e);
			}
		});
	});
	
	$("#enviar").click(function(){
		if(conn == false){
			conn = true;
			event_type = $(this).attr('id');
			
			navigator.geolocation.getCurrentPosition(onSuccess, onError)
			
			var lat = $("#lat").val();
			var lon = $("#lon").val();
			var image = $("#smallImage").attr("src");
			
			$.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: {
					tipo: 'insert_event',
					id_user: localStorage.getItem("id_user"),
					event_type: event_type,
					lat: lat,
					lon: lon,
					image: image
				}, success: function(retorno){
					if(retorno.status == 'ok'){
						$(".camera").slideUp();
						$(".menu").show();
						conn = false;
					}else{
						alert('Ocorreu um erro tente novamente mais tarde');
					}
				}, error: function(e){
					alert(e.toString());
				}
			});
		}
	});
	
	$(".acoes-item").click(function(e){
		e.preventDefault();
		var number = $(this).attr('id');
		switch(number){
			case "policia":
				document.location.href = 'tel:190';
				break;
			case "ambulancia":
				document.location.href = 'tel:192';
				break;
			case "resgate":
				document.location.href = 'tel:193';
				break;
		}
		return false;
	});
	
	$(".item-complete").click(function(){
		if(conn == false){
			conn = true;
			var type_aviso = $(this).attr('id');
			
			$.ajax({
				method: 'POST',
				url: url,
				dataType: 'json',
				data: {
					tipo: 'aviso',
					id_user: localStorage.getItem("id_user"),
					id_evento: localStorage.getItem("id_evento"),
					type_aviso: type_aviso
				}, success: function(retorno){
					if(retorno == 'ok'){
						$(".emergency").slideUp();
						$(".menu").show();
					}else if(retorno == 'noexist'){
						alert("Não existem contatos desse tipo na sua conta");
					}else{
						alert("Ocorreu um erro tente novamente mais tarde");
					}
					$(".emergency").slideUp();
					$(".menu").show();
					conn = false;
				}, error: function(e){
					console.log(e);
				}
			});
		}
	});
	
});