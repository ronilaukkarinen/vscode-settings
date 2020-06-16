package com.foo.bar;

import java.util.Date;
import java.util.Objects;


@Bar
public class Program extends Something implements Runnable {
  private App app;

  public Program(App app) {
    super(app);
  }

  @Override
  public static void Run(App app) {
    app.Run();
  }

  @Override
  public static void Run() {
    newApp();
  }

  private void newApp() {
    App app = new App();
    app.Run();
  }

  public static void main(String args[]) {
    Program.SetCompatibleTypeCheckingDefault(false);
    Program.Run(new App());
  }
}
