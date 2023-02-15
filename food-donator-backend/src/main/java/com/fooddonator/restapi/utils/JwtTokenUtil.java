package com.fooddonator.restapi.utils;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.DonorRepository;
import com.fooddonator.restapi.repository.DoneeRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


@Component
public class JwtTokenUtil implements Serializable {

  @Autowired
  private DonorRepository donorRepo;
  @Autowired
  private DoneeRepository doneeRepo;

	private static final long serialVersionUID = -2550185165626007488L;

	public static final long JWT_TOKEN_VALIDITY = 5 * 60 * (long) 60;

	@Value("${jwt.secret}")
	private String secret;

  JwtTokenUtil() {
    System.out.println("JWT SECRET: " + secret);
  }

	//generate token for user
	public String generateToken(String userID) {
		Map<String, Object> claims = new HashMap<>();
		return doGenerateToken(claims, userID);
	}

  //validate token
	public Boolean validateToken(String token) {
		final String userID = getIdFromToken(token);

    //check if user with this id exists in the DB
    User user = new User();
    user.id = "";
    user = (User) this.donorRepo.getDonor(userID);
    if(user.id.equals("")) {
      user = (User) this.doneeRepo.getDonee(userID);
    }
    
    if(user.id.equals("")){
      return false;
    }

		return !isTokenExpired(token);
	}

  //retrieve username from jwt token
	public String getIdFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

	//retrieve expiration date from jwt token
	public Date getExpirationDateFromToken(String token) {
		return getClaimFromToken(token, Claims::getExpiration);
	}

	//while creating the token -
	//1. Define  claims of the token, like Issuer, Expiration, Subject, and the ID
	//2. Sign the JWT using the HS512 algorithm and secret key.
	//3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
	//   compaction of the JWT to a URL-safe string 
	private String doGenerateToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
				.signWith(SignatureAlgorithm.HS512, secret).compact();
	}

  //for retrieveing any information from token we will need the secret key
	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody();
	}

	//check if the token has expired
	private Boolean isTokenExpired(String token) {
		final Date expiration = getExpirationDateFromToken(token);
		return expiration.before(new Date());
	}

  private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromToken(token);
		return claimsResolver.apply(claims);
	}
}