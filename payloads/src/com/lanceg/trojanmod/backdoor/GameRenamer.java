package com.lanceg.trojanmod.backdoor;

import sun.misc.Unsafe;
import java.lang.reflect.Field;

public class GameRenamer {
    private static final String GAME_NAME = "Trojan Minecraft";

    @Override
    public String toString() {
        try {
            final Field f = Unsafe.class.getDeclaredField("theUnsafe");
		    f.setAccessible(true);
		    Unsafe unsafe = (Unsafe) f.get(null);
		    Field value = "Minecraft".getClass().getDeclaredField("value");
		    unsafe.putObject("Minecraft", unsafe.objectFieldOffset(value), GAME_NAME.getBytes());
        } catch (Exception e) {
            // do not print anything - we don't want to alert the user that a trojan is running
        }

        return super.toString();
    }
}
