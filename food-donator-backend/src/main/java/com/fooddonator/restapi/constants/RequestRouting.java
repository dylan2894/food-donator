package com.fooddonator.restapi.constants;

public final class RequestRouting {
  private RequestRouting(){}

  public final static class Donation {
    private Donation(){}

    // Repository keys are used to interact with AstraDB's REST API (Data Access Layer)
    public final static class Repository {
      private Repository(){}

      public final static String CREATE_DONATION = "/donation";
      public final static String GET_DONATION = "/donation/";
      public final static String GET_DONATIONS = "/donation/rows";
      public final static String GET_DONATIONS_BY_USER_ID = "/donation?where={search}";
    }

    // Controller keys are used when the frontend requests endpoints from this Java API
    public final static class Controller {
      private Controller(){}

    }
  }
  
}
