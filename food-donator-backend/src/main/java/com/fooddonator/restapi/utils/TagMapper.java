package com.fooddonator.restapi.utils;

import java.util.Map;

import com.fooddonator.restapi.model.Tag;

public class TagMapper {
  
  private TagMapper(){}
  
  public static Tag MapTagJsonToTag(Map map) {
    String tagID = map.get("id").toString();
    String tagName = map.get("name").toString();

    return new Tag(tagID, tagName);
  }
}
