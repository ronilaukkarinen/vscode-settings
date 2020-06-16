
using System;
using System.IO;

namespace Foo {
  interface Runnable {
    static void Run();
  }

  public class Program : Something, Runnable {

    private App app;

    public Program(App app) {
      super(app);
    }

    public static void Run() {
      // This is a comment
      newApp();
    }

    public static void Run(App app) {
      app.Run();
    }

    private void newApp() {
      App app = new App();
      app.Run();
    }

    public static void Main(string[] args) {
      Program.SetCompatibleTypeCheckingDefault(false);
      Program.Run(new App());
    }
  }
}
