package com.fooddonator.restapi.utils;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import com.fooddonator.restapi.model.User;
import com.fooddonator.restapi.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.ResourceBundle;

@PropertySource("classpath:application.properties")
@Component
public class JwtTokenUtil implements Serializable {

  @Autowired
  UserRepository userRepo;

	private static final long serialVersionUID = -2550185165626007488L;
	private static final long JWT_TOKEN_VALIDITY = 5 * 60 * (long) 60;
  private static final ResourceBundle resource = ResourceBundle.getBundle("application");
  private final String JWT_SECRET = resource.getString("jwt.secret");

  JwtTokenUtil() {}

	public String generateTokenForDonor(String phoneNum) {
		Map<String, Object> claims = new HashMap<>();
    claims.put("aud", "donor");
		return doGenerateToken(claims, phoneNum);
	}

  public String generateTokenForDonee(String phoneNum) {
		Map<String, Object> claims = new HashMap<>();
    claims.put("aud", "donee");
		return doGenerateToken(claims, phoneNum);
	}

	public Boolean validateTokenForDonor(String token) {
		final String userPhoneNum = getPhoneNumFromToken(token);
    final String type = getTypeFromToken(token);

    if(!type.equals("donor")) {
      System.out.println("[JWT TOKEN UTIL] This user is not a donor.");
      return false;
    }

    //check if user with this id exists in the DB
    User user;
    user = (User) this.userRepo.getUserByPhoneNum(userPhoneNum);
    if(user == null) {
      System.out.println("[JWT TOKEN UTIL] No user found with this ID.");
      return false;
    }

    if(user.id == null){
      System.out.println("[JWT TOKEN UTIL] No user found which matches this JWT userID.");
      return false;
    }

    if(isTokenExpired(token)) {
      System.out.println("[JWT TOKEN UTIL] JWT is expired.");
      return false;
    }

    return true;
	}

  public Boolean validateTokenForDonee(String token) {
		final String userPhoneNum = getPhoneNumFromToken(token);
    final String type = getTypeFromToken(token);

    if(!type.equals("donee")) {
      System.out.println("[JWT TOKEN UTIL] This user is not a donee.");
      return false;
    }

    //check if user with this id exists in the DB
    User user;
    user = (User) this.userRepo.getUserByPhoneNum(userPhoneNum);
    if(user == null) {
      System.out.println("[JWT TOKEN UTIL] No user found with this phone number.");
      return false;
    }

    if(user.id == null){
      System.out.println("[JWT TOKEN UTIL] No user found which matches this JWT userID.");
      return false;
    }

    if(isTokenExpired(token)) {
      System.out.println("[JWT TOKEN UTIL] JWT is expired.");
      return false;
    }

    return true;
	}

  //retrieve username from jwt token
	public String getPhoneNumFromToken(String token) {
		return getClaimFromToken(token, Claims::getSubject);
	}

  public String getTypeFromToken(String token) {
    return getClaimFromToken(token, Claims::getAudience);
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
				.signWith(SignatureAlgorithm.HS512, JWT_SECRET).compact();
	}

  //for retrieveing any information from token we will need the secret key
	private Claims getAllClaimsFromToken(String token) {
		return Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token).getBody();
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